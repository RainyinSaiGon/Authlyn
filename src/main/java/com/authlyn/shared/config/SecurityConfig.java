package com.authlyn.shared.config;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.authlyn.shared.ratelimit.LoginRateLimitFilter;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtSessionStateValidator;
import com.authlyn.shared.security.jwt.RsaKeyService;
import com.authlyn.shared.security.oauth2.OAuth2LoginSuccessHandler;
import com.authlyn.shared.security.state.RedisSessionStateService;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
                                            AuthlynJwtProperties properties,
                                            LoginRateLimitFilter loginRateLimitFilter,
                                            OAuth2LoginSuccessHandler oauth2SuccessHandler,
                                            Optional<ClientRegistrationRepository> clientRegistrationRepository)
            throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .addFilterBefore(loginRateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus",
                                properties.getJwksPath()).permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        // Only wire oauth2Login when at least one provider is registered in application config.
        if (clientRegistrationRepository.isPresent()) {
            http.oauth2Login(oauth2 -> oauth2.successHandler(oauth2SuccessHandler));
        }

        return http.build();
    }

    @Bean
    JwtEncoder jwtEncoder(RsaKeyService rsaKeyService) {
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(rsaKeyService.getSigningKey())));
    }

    @Bean
    JwtDecoder jwtDecoder(RsaKeyService rsaKeyService,
                          AuthlynJwtProperties properties,
                          RedisSessionStateService sessionStateService) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(rsaKeyService.getPublicKey()).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(properties.getIssuer()),
                new JwtSessionStateValidator(sessionStateService)));
        return decoder;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${authlyn.web.allowed-origins:http://localhost:5173}") String allowedOrigins) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
