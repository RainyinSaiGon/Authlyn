package com.authlyn.modules.system.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authlyn.shared.security.jwt.AuthlynJwtProperties;

@RestController
@RequestMapping("/api/public")
public class PublicMetaController {

    private final String applicationName;
    private final AuthlynJwtProperties jwtProperties;

    public PublicMetaController(
            @Value("${spring.application.name:authlyn}") String applicationName,
            AuthlynJwtProperties jwtProperties) {
        this.applicationName = applicationName;
        this.jwtProperties = jwtProperties;
    }

    @GetMapping("/meta")
    public PublicMetaResponse meta() {
        return new PublicMetaResponse(
                applicationName,
                "ok",
                jwtProperties.getJwksPath(),
                "ARCHITECTURE.md");
    }
}
