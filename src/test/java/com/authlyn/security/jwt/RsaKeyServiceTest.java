package com.authlyn.security.jwt;

import com.nimbusds.jose.jwk.RSAKey;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RsaKeyServiceTest {

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

