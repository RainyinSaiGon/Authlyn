package com.authlyn.shared.security.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.nimbusds.jose.jwk.RSAKey;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RsaKeyServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void generatesAnEphemeralKeyWhenNothingIsConfigured() {
        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        RsaKeyService service = new RsaKeyService(properties);

        RSAKey signingKey = service.getSigningKey();

        assertNotNull(signingKey);
        assertTrue(signingKey.getKeyID().startsWith("authlyn-"));
        assertNotNull(service.getPublicKey());
        assertNotNull(service.getPrivateKey());
    }

    @Test
    void loadsInlinePemKeys() throws Exception {
        KeyPair keyPair = generateKeyPair();

        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        properties.setKid("test-kid");
        properties.setPrivateKey(toPem("PRIVATE KEY", keyPair.getPrivate().getEncoded()));
        properties.setPublicKey(toPem("PUBLIC KEY", keyPair.getPublic().getEncoded()));

        RsaKeyService service = new RsaKeyService(properties);

        RSAPublicKey publicKey = service.getPublicKey();
        RSAPrivateKey privateKey = service.getPrivateKey();

        assertEquals(((RSAPublicKey) keyPair.getPublic()).getModulus(), publicKey.getModulus());
        assertEquals(((RSAPublicKey) keyPair.getPublic()).getPublicExponent(), publicKey.getPublicExponent());
        assertEquals(((RSAPrivateKey) keyPair.getPrivate()).getModulus(), privateKey.getModulus());
        assertEquals("test-kid", service.getSigningKey().getKeyID());
    }

    @Test
    void loadsKeysFromFilesystemPath() throws Exception {
        KeyPair keyPair = generateKeyPair();
        Path privateKeyFile = tempDir.resolve("private.pem");
        Path publicKeyFile = tempDir.resolve("public.pem");
        Files.writeString(privateKeyFile, toPem("PRIVATE KEY", keyPair.getPrivate().getEncoded()));
        Files.writeString(publicKeyFile, toPem("PUBLIC KEY", keyPair.getPublic().getEncoded()));

        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        properties.setPrivateKeyPath(privateKeyFile.toString());
        properties.setPublicKeyPath(publicKeyFile.toString());

        RsaKeyService service = new RsaKeyService(properties);

        assertEquals(((RSAPublicKey) keyPair.getPublic()).getModulus(), service.getPublicKey().getModulus());
    }

    @Test
    void throwsWhenPublicKeyConfiguredWithoutPrivateKey() {
        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        properties.setPublicKey("-----BEGIN PUBLIC KEY-----\nfake\n-----END PUBLIC KEY-----");

        assertThrows(IllegalStateException.class, () -> new RsaKeyService(properties));
    }

    @Test
    void throwsWhenPublicAndPrivateKeysDontMatch() throws Exception {
        KeyPair pair1 = generateKeyPair();
        KeyPair pair2 = generateKeyPair();

        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        properties.setPrivateKey(toPem("PRIVATE KEY", pair1.getPrivate().getEncoded()));
        properties.setPublicKey(toPem("PUBLIC KEY", pair2.getPublic().getEncoded()));

        assertThrows(IllegalStateException.class, () -> new RsaKeyService(properties));
    }

    @Test
    void ephemeralKeyIsInCrtFormAndSigningThroughputIsMeasured() {
        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        RsaKeyService service = new RsaKeyService(properties);

        // JVM-generated ephemeral keys always expose CRT parameters.
        assertTrue(service.getPrivateKey() instanceof RSAPrivateCrtKey,
                "Ephemeral RSA key must be in CRT form for optimized signing");
        assertTrue(service.getSigningNanosPerOp() > 0,
                "Signing throughput measurement must produce a positive ns/op value");
    }

    @Test
    void crtSpeedupVsNonCrtIsPositive() {
        AuthlynJwtProperties properties = new AuthlynJwtProperties();
        RsaKeyService service = new RsaKeyService(properties);

        // CRT decomposition is always faster than naive modular exponentiation on the same key material.
        assertTrue(service.getCrtSpeedupPercent() > 0,
                "CRT key must be measurably faster than a non-CRT key on the same modulus");
    }

    @Test
    void inlinePemStrategyIsSelectedForPemHeaderInput() {
        InlinePemKeyMaterialSource source = new InlinePemKeyMaterialSource();

        assertTrue(source.supports("-----BEGIN PRIVATE KEY-----\nfoo\n-----END PRIVATE KEY-----"));
        assertTrue(source.supports("-----BEGIN PUBLIC KEY-----\nbar\n-----END PUBLIC KEY-----"));

        String loaded = source.load("-----BEGIN PRIVATE KEY-----\nfoo\n-----END PRIVATE KEY-----");
        assertEquals("-----BEGIN PRIVATE KEY-----\nfoo\n-----END PRIVATE KEY-----", loaded);
    }

    @Test
    void springResourceStrategyIsSelectedForClasspathPrefix() {
        SpringResourceKeyMaterialSource source = new SpringResourceKeyMaterialSource();

        assertTrue(source.supports("classpath:test-keys/private.pem"));
        assertTrue(source.supports("file:/some/path.pem"));
    }

    @Test
    void filesystemStrategyIsSelectedForExistingPath() throws IOException {
        Path keyFile = tempDir.resolve("key.pem");
        Files.writeString(keyFile, "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

        FilesystemKeyMaterialSource source = new FilesystemKeyMaterialSource();

        assertTrue(source.supports(keyFile.toString()));
        assertEquals("-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----", source.load(keyFile.toString()));
    }

    @Test
    void fallbackStrategySupportsAnyNonNullValue() {
        FallbackResourceKeyMaterialSource source = new FallbackResourceKeyMaterialSource();

        assertTrue(source.supports("anything"));
        assertTrue(source.supports("some-inline-value"));
    }

    private KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    private String toPem(String type, byte[] encoded) {
        String base64 = Base64.getMimeEncoder(64, "\n".getBytes(StandardCharsets.UTF_8)).encodeToString(encoded);
        return "-----BEGIN " + type + "-----\n" + base64 + "\n-----END " + type + "-----";
    }
}
