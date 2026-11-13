package com.authlyn.shared.security.oauth2;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import com.authlyn.modules.identity.domain.IdentityEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.repository.IdentityJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.modules.identity.service.OAuthLoginCodeService;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OAuth2LoginSuccessHandlerTest {

    private static final String REDIRECT = "http://localhost:5173/oauth/callback";

    private UserJpaRepository userRepository;
    private IdentityJpaRepository identityRepository;
    private SessionJpaRepository sessionRepository;
    private OAuthLoginCodeService loginCodeService;
    private OAuth2LoginSuccessHandler handler;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserJpaRepository.class);
        identityRepository = mock(IdentityJpaRepository.class);
        sessionRepository = mock(SessionJpaRepository.class);
        loginCodeService = mock(OAuthLoginCodeService.class);
        handler = new OAuth2LoginSuccessHandler(userRepository, identityRepository, sessionRepository,
                loginCodeService, new AuthlynJwtProperties(), REDIRECT);

        when(identityRepository.findByProviderAndProviderUserId(any(), any())).thenReturn(Optional.empty());
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(loginCodeService.issueCode(any(), any())).thenReturn("one-time-code");
    }

    @Test
    void testRedirectCarriesOnlyAOneTimeCodeNeverTokens() throws Exception {
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());

        String redirect = login("google", attrs("g-1", "new@example.com", true));

        assertEquals(REDIRECT + "?code=one-time-code", redirect);
        assertFalse(redirect.contains("access_token"));
        assertFalse(redirect.contains("refresh_token"));
    }

    @Test
    void testUnverifiedProviderEmailMatchingAnExistingAccountIsRefused() throws Exception {
        UserEntity victim = user("victim@example.com", true);
        when(userRepository.findByEmail("victim@example.com")).thenReturn(Optional.of(victim));

        // GitHub's /user endpoint sends no email_verified claim, so the email is unverified.
        String redirect = login("github", attrs("gh-attacker", "victim@example.com", null));

        assertEquals(REDIRECT + "?error=" + OAuth2LoginSuccessHandler.ERROR_ACCOUNT_LINK_REQUIRED, redirect);
        verify(identityRepository, never()).save(any());
        verify(loginCodeService, never()).issueCode(any(), any());
    }

    @Test
    void testVerifiedEmailDoesNotLinkOntoAnAccountWhoseEmailIsUnverified() throws Exception {
        when(userRepository.findByEmail("someone@example.com"))
                .thenReturn(Optional.of(user("someone@example.com", false)));

        String redirect = login("google", attrs("g-2", "someone@example.com", true));

        assertTrue(redirect.contains("error=" + OAuth2LoginSuccessHandler.ERROR_ACCOUNT_LINK_REQUIRED));
        verify(identityRepository, never()).save(any());
    }

    @Test
    void testVerifiedEmailLinksToAVerifiedAccount() throws Exception {
        UserEntity existing = user("alice@example.com", true);
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existing));

        String redirect = login("google", attrs("g-3", "Alice@Example.com", true));

        assertTrue(redirect.endsWith("?code=one-time-code"));
        ArgumentCaptor<IdentityEntity> identity = ArgumentCaptor.forClass(IdentityEntity.class);
        verify(identityRepository).save(identity.capture());
        assertEquals(existing.getId(), identity.getValue().getUserId());
        verify(loginCodeService).issueCode(eq(existing.getId()), any());
    }

    @Test
    void testNewAccountFromUnverifiedEmailDoesNotClaimTheAddress() throws Exception {
        when(userRepository.findByEmail("free@example.com")).thenReturn(Optional.empty());

        login("github", attrs("gh-2", "free@example.com", null));

        ArgumentCaptor<UserEntity> saved = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(saved.capture());
        assertEquals("", saved.getValue().getEmail());
        assertFalse(saved.getValue().isEmailVerified());
    }

    @Test
    void testKnownIdentitySignsInAsItsLinkedUser() throws Exception {
        UserEntity existing = user("bob@example.com", true);
        IdentityEntity identity = new IdentityEntity();
        identity.setUserId(existing.getId());
        when(identityRepository.findByProviderAndProviderUserId("google", "g-4")).thenReturn(Optional.of(identity));
        when(userRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        String redirect = login("google", attrs("g-4", "bob@example.com", true));

        assertTrue(redirect.endsWith("?code=one-time-code"));
        verify(loginCodeService).issueCode(eq(existing.getId()), any());
        verify(identityRepository, never()).save(any());
    }

    private String login(String provider, Map<String, Object> attributes) throws Exception {
        DefaultOAuth2User principal = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")), attributes, "sub");
        OAuth2AuthenticationToken token = new OAuth2AuthenticationToken(principal, principal.getAuthorities(), provider);
        MockHttpServletResponse response = new MockHttpServletResponse();
        handler.onAuthenticationSuccess(new MockHttpServletRequest(), response, token);
        String redirect = response.getRedirectedUrl();
        assertNotEquals(null, redirect);
        return redirect;
    }

    private static Map<String, Object> attrs(String sub, String email, Boolean emailVerified) {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("sub", sub);
        attributes.put("email", email);
        if (emailVerified != null) {
            attributes.put("email_verified", emailVerified);
        }
        return attributes;
    }

    private static UserEntity user(String email, boolean verified) {
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setEmailVerified(verified);
        return user;
    }
}
