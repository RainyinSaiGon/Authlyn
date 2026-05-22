package com.authlyn.shared.security.jwt;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final JwtEncoder jwtEncoder;
    private final AuthlynJwtProperties properties;

    public JwtTokenService(JwtEncoder jwtEncoder, AuthlynJwtProperties properties) {
        this.jwtEncoder = jwtEncoder;
        this.properties = properties;
    }

    public String issueAccessToken(UUID userId) {
        return issueAccessToken(userId, null);
    }

    public String issueAccessToken(UUID userId, UUID sessionId) {
        Instant now = Instant.now();
        JwtClaimsSet.Builder builder = JwtClaimsSet.builder()
                .issuer(properties.getIssuer())
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofMinutes(properties.getAccessTokenMinutes())))
                .subject(userId.toString())
                .id(UUID.randomUUID().toString());

        if (sessionId != null) {
            builder.claim("sid", sessionId.toString());
        }

        JwtClaimsSet claims = builder.build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public Instant accessTokenExpiresAt() {
        return Instant.now().plus(Duration.ofMinutes(properties.getAccessTokenMinutes()));
    }
}
