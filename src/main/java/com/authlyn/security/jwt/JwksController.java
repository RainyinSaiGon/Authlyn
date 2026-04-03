package com.authlyn.security.jwt;

import com.nimbusds.jose.jwk.JWKSet;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class JwksController {

    private final RsaKeyService rsaKeyService;

    public JwksController(RsaKeyService rsaKeyService) {
        this.rsaKeyService = rsaKeyService;
    }

    @GetMapping(value = "${authlyn.jwt.jwks-path:/.well-known/jwks.json}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> jwks() {
        return new JWKSet(rsaKeyService.getPublicJwk()).toJSONObject();
    }
}

