package com.authlyn.shared.security.jwt;

class InlinePemKeyMaterialSource implements RsaKeyMaterialSource {

    @Override
    public boolean supports(String value) {
        return value != null && value.contains("-----BEGIN ");
    }

    @Override
    public String load(String value) {
        return value;
    }
}
