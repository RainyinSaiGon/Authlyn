package com.authlyn.shared.security.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class FilesystemKeyMaterialSource implements RsaKeyMaterialSource {

    @Override
    public boolean supports(String value) {
        if (value == null) return false;
        try {
            return Files.exists(Path.of(value));
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    @Override
    public String load(String value) {
        try {
            return Files.readString(Path.of(value), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to read RSA key file: " + value, ex);
        }
    }
}
