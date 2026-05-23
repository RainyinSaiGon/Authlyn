package com.authlyn.shared.security.jwt;

interface RsaKeyMaterialSource {
    boolean supports(String value);
    String load(String value);
}
