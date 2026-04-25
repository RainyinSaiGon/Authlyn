package com.authlyn.shared.security.jwt;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;

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

        Map<?, ?> key = (Map<?, ?>) ((List<?>) response.get("keys")).get(0);
        assertEquals("RSA", key.get("kty"));
        assertEquals("test-kid", key.get("kid"));
        assertEquals("sig", key.get("use"));
        assertEquals("RS256", key.get("alg"));
    }

    private RSAKey createKey() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair pair = generator.generateKeyPair();
        return new RSAKey.Builder((RSAPublicKey) pair.getPublic())
                .privateKey((RSAPrivateKey) pair.getPrivate())
                .keyID("test-kid")
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .build();
    }
}
