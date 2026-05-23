package com.authlyn.shared.security.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;

class SpringResourceKeyMaterialSource implements RsaKeyMaterialSource {

    @Override
    public boolean supports(String value) {
        return value != null && (value.startsWith("classpath:") || value.startsWith("file:"));
    }

    @Override
    public String load(String value) {
        Resource resource = new DefaultResourceLoader().getResource(value);
        if (!resource.exists()) {
            throw new IllegalStateException("RSA key resource not found: " + value);
        }
        try {
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to read RSA key resource: " + value, ex);
        }
    }
}
