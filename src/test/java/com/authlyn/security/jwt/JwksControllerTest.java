package com.authlyn.security.jwt;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import org.junit.jupiter.api.Test;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JwksControllerTest {

    @Test
    void exposesPublicJwks() throws Exception {
        RSAKey jwk = createKey();
        RsaKeyService rsaKeyService = new RsaKeyService(new AuthlynJwtProperties()) {
            @Override
            public RSAKey getPublicJwk() {
                return jwk.toPublicJWK();
            }
        };

        JwksController controller = new JwksController(rsaKeyService);
        Map<String, Object> response = controller.jwks();

        assertEquals("RSA", ((Map<?, ?>) ((java.util.List<?>) response.get("keys")).get(0)).get("kty"));
        assertEquals("test-kid", ((Map<?, ?>) ((java.util.List<?>) response.get("keys")).get(0)).get("kid"));
        assertEquals("sig", ((Map<?, ?>) ((java.util.List<?>) response.get("keys")).get(0)).get("use"));
        assertEquals("RS256", ((Map<?, ?>) ((java.util.List<?>) response.get("keys")).get(0)).get("alg"));
    }

    private RSAKey createKey() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair pair = generator.generateKeyPair();
        return new RSAKey.Builder((java.security.interfaces.RSAPublicKey) pair.getPublic())
                .privateKey((java.security.interfaces.RSAPrivateKey) pair.getPrivate())
                .keyID("test-kid")
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .build();
    }
}

