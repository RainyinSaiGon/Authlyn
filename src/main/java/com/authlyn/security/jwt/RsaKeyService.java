package com.authlyn.security.jwt;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class RsaKeyService {

    private final AuthlynJwtProperties properties;
    private final RSAKey signingKey;
    private final RSAKey publicJwk;
    private final RSAPublicKey publicKey;
    private final RSAPrivateKey privateKey;

    public RsaKeyService(AuthlynJwtProperties properties) {
        this.properties = properties;
        LoadedKeyPair keyPair = loadSigningKey();
        this.signingKey = keyPair.signingKey();
        this.publicJwk = keyPair.publicJwk();
        this.publicKey = keyPair.publicKey();
        this.privateKey = keyPair.privateKey();
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

    private LoadedKeyPair loadSigningKey() {
        String privateKeySource = firstNonBlank(properties.getPrivateKeyPath(), properties.getPrivateKey());
        String publicKeySource = firstNonBlank(properties.getPublicKeyPath(), properties.getPublicKey());

        if (privateKeySource == null) {
            if (publicKeySource != null) {
                throw new IllegalStateException("AUTHLYN_JWT_PUBLIC_KEY(_PATH) was provided without a private key; set AUTHLYN_JWT_PRIVATE_KEY(_PATH) too.");
            }
            return generateEphemeralKey();
        }

        RSAPrivateKey privateKey = parsePrivateKey(readKeyMaterial(privateKeySource));
        RSAPublicKey publicKey = publicKeySource == null
                ? derivePublicKey(privateKey)
                : parsePublicKey(readKeyMaterial(publicKeySource));

        RSAPublicKey derivedPublicKey = derivePublicKey(privateKey);
        if (!publicKeysMatch(publicKey, derivedPublicKey)) {
            throw new IllegalStateException("Configured public key does not match the configured private key.");
        }

        return buildKeyPair(privateKey, publicKey);
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
        RSAKey signingKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID(kid)
                .build();

        RSAKey publicJwk = new RSAKey.Builder(publicKey)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID(kid)
                .build();

        return new LoadedKeyPair(signingKey, publicJwk, publicKey, privateKey);
    }

    private String defaultKid(RSAPublicKey publicKey) {
        return "authlyn-" + publicKey.getModulus().abs().toString(16).substring(0, 12);
    }

    private RSAPrivateKey parsePrivateKey(String pemOrPathContents) {
        try {
            byte[] decoded = decodePem(pemOrPathContents, "PRIVATE KEY");
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to load the configured RSA private key.", ex);
        }
    }

    private RSAPublicKey parsePublicKey(String pemOrPathContents) {
        try {
            byte[] decoded = decodePem(pemOrPathContents, "PUBLIC KEY");
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
        } catch (Exception ex) {
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

    private String readKeyMaterial(String value) {
        if (!hasText(value)) {
            throw new IllegalStateException("Key material cannot be blank.");
        }

        if (value.contains("-----BEGIN ")) {
            return value;
        }

        if (value.startsWith("classpath:") || value.startsWith("file:")) {
            Resource resource = new DefaultResourceLoader().getResource(value);
            if (resource.exists()) {
                try {
                    return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                } catch (IOException ex) {
                    throw new IllegalStateException("Unable to read RSA key resource: " + value, ex);
                }
            }
        }

        try {
            Path path = Path.of(value);
            if (Files.exists(path)) {
                try {
                    return Files.readString(path, StandardCharsets.UTF_8);
                } catch (IOException ex) {
                    throw new IllegalStateException("Unable to read RSA key file: " + path, ex);
                }
            }
        } catch (RuntimeException ignored) {
            // Fall through and treat the input as inline key material.
        }

        Resource resource = new DefaultResourceLoader().getResource(value);
        if (resource.exists()) {
            try {
                return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            } catch (IOException ex) {
                throw new IllegalStateException("Unable to read RSA key resource: " + value, ex);
            }
        }

        return value;
    }

    private RSAPublicKey derivePublicKey(RSAPrivateKey privateKey) {
        try {
            KeyFactory factory = KeyFactory.getInstance("RSA");
            if (privateKey instanceof RSAPrivateCrtKey crtKey) {
                return (RSAPublicKey) factory.generatePublic(new RSAPublicKeySpec(crtKey.getModulus(), crtKey.getPublicExponent()));
            }
            throw new IllegalStateException("Configured RSA private key does not expose CRT parameters required to derive the public key.");
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to derive the public key from the configured private key.", ex);
        }
    }

    private boolean publicKeysMatch(RSAPublicKey configured, RSAPublicKey derived) {
        return configured.getModulus().equals(derived.getModulus())
                && configured.getPublicExponent().equals(derived.getPublicExponent());
    }

    private String firstNonBlank(String first, String second) {
        if (hasText(first)) {
            return first.trim();
        }
        if (hasText(second)) {
            return second.trim();
        }
        return null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private record LoadedKeyPair(RSAKey signingKey, RSAKey publicJwk, RSAPublicKey publicKey, RSAPrivateKey privateKey) {
    }
}

