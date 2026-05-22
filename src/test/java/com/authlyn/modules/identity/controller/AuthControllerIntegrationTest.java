package com.authlyn.modules.identity.controller;

import com.authlyn.modules.identity.dto.LoginRequest;
import com.authlyn.modules.identity.dto.SignupRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import com.authlyn.shared.security.state.RedisSessionStateService;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
                "spring.datasource.url=jdbc:h2:mem:authlyn-it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.flyway.enabled=false"
})
class AuthControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

        private final ObjectMapper objectMapper = new ObjectMapper();

        @MockitoBean
        private RedisSessionStateService redisSessionStateService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testSignupReturns201WithTokens() throws Exception {
        mockMvc.perform(post("/api/public/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest("signup201@example.com", "SecurePass1!", "Alice"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId", notNullValue()))
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));
    }

    @Test
    void testSignupRejects409OnDuplicateEmail() throws Exception {
        String body = objectMapper.writeValueAsString(
                new SignupRequest("dup409@example.com", "SecurePass1!", null));

        mockMvc.perform(post("/api/public/auth/signup")
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/public/auth/signup")
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void testLoginWithValidCredentialsReturns200() throws Exception {
        String email = "login200@example.com";
        mockMvc.perform(post("/api/public/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest(email, "SecurePass1!", null))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/public/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, "SecurePass1!"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));
    }

    @Test
    void testLoginReturns401ForWrongPassword() throws Exception {
        String email = "wrongpass401@example.com";
        mockMvc.perform(post("/api/public/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest(email, "SecurePass1!", null))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/public/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, "WrongPassword!"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testRefreshRotatesTokenAndReuseIsRejected() throws Exception {
        String email = "refresh@example.com";
        MvcResult signupResult = mockMvc.perform(post("/api/public/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest(email, "SecurePass1!", null))))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> signup = objectMapper.readValue(signupResult.getResponse().getContentAsString(), Map.class);
        String originalRefreshToken = (String) signup.get("refreshToken");

        // First rotation succeeds
        mockMvc.perform(post("/api/public/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", originalRefreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));

        // Reusing the already-rotated token triggers reuse detection
        mockMvc.perform(post("/api/public/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", originalRefreshToken))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testMeEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testMeEndpointReturnsCurrentUserWithValidToken() throws Exception {
        String email = "me@example.com";
        MvcResult signupResult = mockMvc.perform(post("/api/public/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest(email, "SecurePass1!", "Me User"))))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> signup = objectMapper.readValue(signupResult.getResponse().getContentAsString(), Map.class);
        String accessToken = (String) signup.get("accessToken");

        mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.userId", notNullValue()));
    }
}
