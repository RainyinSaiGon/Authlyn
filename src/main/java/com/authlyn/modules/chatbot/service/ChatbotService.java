package com.authlyn.modules.chatbot.service;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.SignalType;

import com.authlyn.modules.chatbot.prompt.ChatbotPrompts;
import com.authlyn.modules.chatbot.service.tools.AdminMetricsTools;
import com.authlyn.modules.chatbot.service.tools.SessionManagementTools;

@Service
public class ChatbotService {

    private final ChatClient chatClient;
    private final ChatbotMessagePersister persister;

    public ChatbotService(ChatClient.Builder builder,
                          VectorStore vectorStore,
                          ChatMemory chatMemory,
                          AdminMetricsTools metricsTools,
                          SessionManagementTools sessionTools,
                          ChatbotMessagePersister persister) {
        this.chatClient = builder
                .defaultSystem(ChatbotPrompts.SYSTEM_PROMPT)
                .defaultAdvisors(
                        QuestionAnswerAdvisor.builder(vectorStore)
                                .searchRequest(SearchRequest.builder().topK(4).similarityThreshold(0.5).build())
                                .build(),
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .defaultTools(metricsTools, sessionTools)
                .build();
        this.persister = persister;
    }

    public Flux<String> stream(UUID conversationId, UUID adminUserId, String userMessage) {
        persister.saveUserMessage(conversationId, adminUserId, userMessage);

        var accumulated = new StringBuilder();
        var promptTokens = new AtomicInteger(0);
        var completionTokens = new AtomicInteger(0);

        return chatClient
                .prompt()
                .user(userMessage)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, conversationId.toString()))
                .stream()
                .chatResponse()
                .doOnNext(cr -> {
                    if (cr.getResult() != null) {
                        var text = cr.getResult().getOutput().getText();
                        if (text != null && !text.isEmpty()) {
                            accumulated.append(text);
                        }
                    }
                    var usage = cr.getMetadata() != null ? cr.getMetadata().getUsage() : null;
                    if (usage != null) {
                        Integer pt = usage.getPromptTokens();
                        Integer ct = usage.getCompletionTokens();
                        if (pt != null && pt > 0) promptTokens.set(pt);
                        if (ct != null && ct > 0) completionTokens.set(ct);
                    }
                })
                .mapNotNull(cr -> cr.getResult() != null ? cr.getResult().getOutput().getText() : null)
                .filter(token -> !token.isEmpty())
                .doFinally(signal -> {
                    if (accumulated.isEmpty()) return;
                    boolean completed = signal == SignalType.ON_COMPLETE;
                    persister.saveAssistantMessage(
                            conversationId,
                            accumulated.toString(),
                            completed ? promptTokens.get() : 0,
                            completed ? completionTokens.get() : 0,
                            completed);
                });
    }
}
