package com.authlyn.shared.security.jwt;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;

@Service
public class RsaKeyService {

    private static final Logger logger = LoggerFactory.getLogger(RsaKeyService.class);

    // Strategies are tried in declaration order; first match wins.
    private static final List<RsaKeyMaterialSource> KEY_MATERIAL_SOURCES = List.of(
            new InlinePemKeyMaterialSource(),
            new SpringResourceKeyMaterialSource(),
            new FilesystemKeyMaterialSource(),
            new FallbackResourceKeyMaterialSource()
    );

    private final AuthlynJwtProperties properties;
    private final RSAKey signingKey;
    private final RSAKey publicJwk;
    private final RSAPublicKey publicKey;
    private final RSAPrivateKey privateKey;
    private final long signingNanosPerOp;
    private final int crtSpeedupPercent;

    public RsaKeyService(AuthlynJwtProperties properties) {
        this.properties = properties;
        LoadedKeyPair keyPair = loadSigningKey();
        this.signingKey = keyPair.signingKey();
        this.publicJwk = keyPair.publicJwk();
        this.publicKey = keyPair.publicKey();
        this.privateKey = keyPair.privateKey();
        this.signingNanosPerOp = measureSigningThroughput(keyPair.privateKey());
        if (keyPair.privateKey() instanceof RSAPrivateCrtKey crtKey) {
            this.crtSpeedupPercent = measureCrtSpeedup(crtKey);
            logger.info("RSA signing key loaded; CRT form: true; throughput: {} ns/op; CRT speedup vs non-CRT: {}%",
                    signingNanosPerOp, crtSpeedupPercent);
        } else {
            this.crtSpeedupPercent = 0;
            logger.info("RSA signing key loaded; CRT form: false; throughput: {} ns/op", signingNanosPerOp);
        }
    }

    public RSAKey getSigningKey() {
        return signingKey;
    }

    public RSAKey getPublicJwk() {
        return publicJwk;
    }

    public RSAPublicKey getPublicKey() {
        return publicKey;
    }

    public RSAPrivateKey getPrivateKey() {
        return privateKey;
    }

    /** Nanoseconds per RSA sign operation measured at startup; -1 if measurement failed. */
    public long getSigningNanosPerOp() {
        return signingNanosPerOp;
    }

    /** Percentage by which CRT signing outperforms non-CRT on the loaded key; 0 if key is not CRT form. */
    public int getCrtSpeedupPercent() {
        return crtSpeedupPercent;
    }

    private LoadedKeyPair loadSigningKey() {
        String privateKeySource = firstNonBlank(properties.getPrivateKeyPath(), properties.getPrivateKey());
        String publicKeySource = firstNonBlank(properties.getPublicKeyPath(), properties.getPublicKey());

        if (privateKeySource == null) {
            if (publicKeySource != null) {
                throw new IllegalStateException("AUTHLYN_JWT_PUBLIC_KEY(_PATH) was provided without a private key; set AUTHLYN_JWT_PRIVATE_KEY(_PATH) too.");
            }
            return generateEphemeralKey();
        }

        RSAPrivateKey loadedPrivateKey = parsePrivateKey(resolveKeyMaterial(privateKeySource));
        RSAPublicKey loadedPublicKey = publicKeySource == null
                ? derivePublicKey(loadedPrivateKey)
                : parsePublicKey(resolveKeyMaterial(publicKeySource));

        RSAPublicKey derivedPublicKey = derivePublicKey(loadedPrivateKey);
        if (!publicKeysMatch(loadedPublicKey, derivedPublicKey)) {
            throw new IllegalStateException("Configured public key does not match the configured private key.");
        }

        return buildKeyPair(loadedPrivateKey, loadedPublicKey);
    }

    private String resolveKeyMaterial(String value) {
        if (!hasText(value)) {
            throw new IllegalStateException("Key material cannot be blank.");
        }
        return KEY_MATERIAL_SOURCES.stream()
                .filter(source -> source.supports(value))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No key material source supports: " + value))
                .load(value);
    }

    private LoadedKeyPair generateEphemeralKey() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair pair = generator.generateKeyPair();
            return buildKeyPair((RSAPrivateKey) pair.getPrivate(), (RSAPublicKey) pair.getPublic());
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("RSA algorithm is not available on this JVM.", ex);
        }
    }

    private LoadedKeyPair buildKeyPair(RSAPrivateKey privateKey, RSAPublicKey publicKey) {
        String kid = hasText(properties.getKid()) ? properties.getKid() : defaultKid(publicKey);
        RSAKey signingRsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID(kid)
                .build();

        RSAKey publicRsaJwk = new RSAKey.Builder(publicKey)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID(kid)
                .build();

        return new LoadedKeyPair(signingRsaKey, publicRsaJwk, publicKey, privateKey);
    }

    private String defaultKid(RSAPublicKey publicKey) {
        return "authlyn-" + publicKey.getModulus().abs().toString(16).substring(0, 12);
    }

    private RSAPrivateKey parsePrivateKey(String pem) {
        try {
            byte[] decoded = decodePem(pem, "PRIVATE KEY");
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
        } catch (GeneralSecurityException | IllegalArgumentException ex) {
            throw new IllegalStateException("Unable to load the configured RSA private key.", ex);
        }
    }

    private RSAPublicKey parsePublicKey(String pem) {
        try {
            byte[] decoded = decodePem(pem, "PUBLIC KEY");
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
        } catch (GeneralSecurityException | IllegalArgumentException ex) {
            throw new IllegalStateException("Unable to load the configured RSA public key.", ex);
        }
    }

    private byte[] decodePem(String value, String type) {
        String normalized = value
                .replace("-----BEGIN " + type + "-----", "")
                .replace("-----END " + type + "-----", "")
                .replaceAll("\\s", "")
                .trim();
        return Base64.getDecoder().decode(normalized.getBytes(StandardCharsets.US_ASCII));
    }

    // Uses CRT parameters (p, q, dp, dq, qInv) when exposed by RSAPrivateCrtKey; the JVM's
    // crypto provider applies CRT decomposition, reducing signing cost vs naive modular exponentiation.
    private RSAPublicKey derivePublicKey(RSAPrivateKey privateKey) {
        if (!(privateKey instanceof RSAPrivateCrtKey crtKey)) {
            throw new IllegalStateException("Configured RSA private key does not expose CRT parameters required to derive the public key.");
        }

        try {
            KeyFactory factory = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) factory.generatePublic(new RSAPublicKeySpec(crtKey.getModulus(), crtKey.getPublicExponent()));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
            throw new IllegalStateException("Unable to derive the public key from the configured private key.", ex);
        }
    }

    // Reconstructs a raw (n, d) key without CRT params to force the JCA into naive modular
    // exponentiation, then measures both paths and returns the percentage speedup from CRT.
    private int measureCrtSpeedup(RSAPrivateCrtKey crtKey) {
        try {
            RSAPrivateKey nonCrtKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
                    .generatePrivate(new RSAPrivateKeySpec(crtKey.getModulus(), crtKey.getPrivateExponent()));
            long crtNs    = measureSigningThroughput(crtKey);
            long nonCrtNs = measureSigningThroughput(nonCrtKey);
            if (nonCrtNs <= 0 || crtNs <= 0) return 0;
            return (int) Math.round((double) (nonCrtNs - crtNs) / nonCrtNs * 100);
        } catch (GeneralSecurityException ex) {
            logger.warn("CRT speedup measurement failed", ex);
            return 0;
        }
    }

    private long measureSigningThroughput(RSAPrivateKey key) {
        byte[] payload = "authlyn-signing-benchmark".getBytes(StandardCharsets.UTF_8);
        try {
            Signature signer = Signature.getInstance("SHA256withRSA");
            for (int i = 0; i < 5; i++) {
                signer.initSign(key);
                signer.update(payload);
                signer.sign();
            }
            int rounds = 20;
            long start = System.nanoTime();
            for (int i = 0; i < rounds; i++) {
                signer.initSign(key);
                signer.update(payload);
                signer.sign();
            }
            return (System.nanoTime() - start) / rounds;
        } catch (GeneralSecurityException ex) {
            logger.warn("RSA signing throughput measurement failed", ex);
            return -1;
        }
    }

    private boolean publicKeysMatch(RSAPublicKey configured, RSAPublicKey derived) {
        return configured.getModulus().equals(derived.getModulus())
                && configured.getPublicExponent().equals(derived.getPublicExponent());
    }

    private String firstNonBlank(String first, String second) {
        if (hasText(first)) return first.trim();
        if (hasText(second)) return second.trim();
        return null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private record LoadedKeyPair(RSAKey signingKey, RSAKey publicJwk, RSAPublicKey publicKey, RSAPrivateKey privateKey) {}
}
