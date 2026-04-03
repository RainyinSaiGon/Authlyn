package com.authlyn.config;

import com.authlyn.security.jwt.AuthlynJwtProperties;
import com.authlyn.security.jwt.RsaKeyService;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, AuthlynJwtProperties properties) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus", properties.getJwksPath()).permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    JwtEncoder jwtEncoder(RsaKeyService rsaKeyService) {
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(rsaKeyService.getSigningKey())));
    }

    @Bean
    JwtDecoder jwtDecoder(RsaKeyService rsaKeyService) {
        return NimbusJwtDecoder.withPublicKey(rsaKeyService.getPublicKey()).build();
    }
}
