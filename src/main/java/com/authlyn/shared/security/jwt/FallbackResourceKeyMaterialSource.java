package com.authlyn.shared.security.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;

// Last-resort strategy: tries Spring resource loader, then treats value as raw inline material.
class FallbackResourceKeyMaterialSource implements RsaKeyMaterialSource {

    @Override
    public boolean supports(String value) {
        return value != null;
    }

    @Override
    public String load(String value) {
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
}
