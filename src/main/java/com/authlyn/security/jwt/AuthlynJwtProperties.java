package com.authlyn.security.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("unused")
public class AuthlynJwtProperties {

    @Value("${authlyn.jwt.issuer:http://localhost:8080}")
    private String issuer;

    @Value("${authlyn.jwt.kid:authlyn-rsa-1}")
    private String kid;

    @Value("${authlyn.jwt.jwks-path:/.well-known/jwks.json}")
    private String jwksPath;

    @Value("${authlyn.jwt.access-token-minutes:15}")
    private long accessTokenMinutes;

    @Value("${authlyn.jwt.refresh-token-days:30}")
    private long refreshTokenDays;

    @Value("${authlyn.jwt.private-key:}")
    private String privateKey;

    @Value("${authlyn.jwt.private-key-path:}")
    private String privateKeyPath;

    @Value("${authlyn.jwt.public-key:}")
    private String publicKey;

    @Value("${authlyn.jwt.public-key-path:}")
    private String publicKeyPath;

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getKid() {
        return kid;
    }

    public void setKid(String kid) {
        this.kid = kid;
    }

    public String getJwksPath() {
        return jwksPath;
    }

    public void setJwksPath(String jwksPath) {
        this.jwksPath = jwksPath;
    }

    public long getAccessTokenMinutes() {
        return accessTokenMinutes;
    }

    public void setAccessTokenMinutes(long accessTokenMinutes) {
        this.accessTokenMinutes = accessTokenMinutes;
    }

    public long getRefreshTokenDays() {
        return refreshTokenDays;
    }

    public void setRefreshTokenDays(long refreshTokenDays) {
        this.refreshTokenDays = refreshTokenDays;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getPrivateKeyPath() {
        return privateKeyPath;
    }

    public void setPrivateKeyPath(String privateKeyPath) {
        this.privateKeyPath = privateKeyPath;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getPublicKeyPath() {
        return publicKeyPath;
    }

    public void setPublicKeyPath(String publicKeyPath) {
        this.publicKeyPath = publicKeyPath;
    }
}

