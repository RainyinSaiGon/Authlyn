package com.authlyn.modules.chatbot.controller;

import java.util.UUID;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import com.authlyn.modules.chatbot.dto.AskRequest;
import com.authlyn.modules.chatbot.service.ChatbotService;

@RestController
@RequestMapping("/api/admin/chatbot")
@PreAuthorize("hasAuthority('SCOPE_admin')")
public class ChatbotController {

    private static final Logger log = LoggerFactory.getLogger(ChatbotController.class);

    private static final String DEGRADED_RESPONSE =
            "[Authlyn AI assistant is temporarily unavailable. " +
            "You can still perform admin actions via the regular admin panel.]";

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping(value = "/ask", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> ask(@Valid @RequestBody AskRequest body,
                            @AuthenticationPrincipal Jwt jwt) {
        UUID adminId = UUID.fromString(jwt.getSubject());
        return chatbotService.stream(body.conversationId(), adminId, body.message())
                .onErrorResume(ex -> {
                    log.error("Chatbot stream error for conversation {}: {}",
                            body.conversationId(), ex.getMessage());
                    return Flux.just(DEGRADED_RESPONSE);
                });
    }
}
