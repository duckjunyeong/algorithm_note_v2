package algorithm_note.algorithm_note_v2.chat.controller;

import algorithm_note.algorithm_note_v2.chat.dto.ChatDoneEventDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatMessageRequestDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatStreamChunkDto;
import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import algorithm_note.algorithm_note_v2.chat.exception.EmitterNotFoundException;
import algorithm_note.algorithm_note_v2.chat.repository.EmitterRepository;
import algorithm_note.algorithm_note_v2.chat.service.ChatSessionManager;
import algorithm_note.algorithm_note_v2.chat.service.GeminiStreamingService;
import algorithm_note.algorithm_note_v2.chat.service.PromptService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.google.genai.Client;
import com.google.genai.ResponseStream;
import com.google.genai.types.GenerateContentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final EmitterRepository emitterRepository;
    private final ChatSessionManager chatSessionManager;
    private final GeminiStreamingService geminiStreamingService;
    private final PromptService promptService;

    private static final long SSE_TIMEOUT = 60 * 60 * 1000L; // 60분

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
        @RequestParam String taskType,
        @RequestParam String taskField,
        @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();
        String userName = user.getFirstName() + " " + user.getLastName();

        log.info("SSE subscribe requested - userId: {}, taskType: {}, taskField: {}",
            userId, taskType, taskField);

        emitterRepository.deleteById(userId);
        try {
            chatSessionManager.deleteSessionByUserId(userId);
        } catch (Exception e) {
            log.debug("No existing session to delete for userId: {}", userId);
        }

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitterRepository.save(userId, emitter);
        emitterRepository.configureCallbacks(userId, emitter);

        chatSessionManager.createSession(userId, taskType, taskField, userName);

        try {
            Map<String, Object> data = new HashMap<>();
            data.put("sessionId", "user-" + userId);
            data.put("message", "Connected successfully");

            emitter.send(SseEmitter.event()
                .name("connected")
                .data(data));

            log.info("SSE connection established for userId: {}", userId);
        } catch (IOException e) {
            log.error("Failed to send connected event", e);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    @PostMapping("/message")
    public void sendMessage(
        @Valid @RequestBody ChatMessageRequestDto request,
        @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();
        String userMessage = request.getMessage();

        log.info("Message received from userId: {}", userId);

        SseEmitter emitter = emitterRepository.get(userId)
            .orElseThrow(() -> new EmitterNotFoundException());

        ChatSession session = chatSessionManager.getSessionByUserId(userId);

        session.addUserMessage(userMessage);
        chatSessionManager.updateSession(session);

        CompletableFuture.runAsync(() -> {
            StringBuilder fullResponse = new StringBuilder();

            try {
                String sessionId = "user-" + userId;
                Client client = chatSessionManager.getClient(sessionId);

                String systemPrompt = promptService.formatPrompt(
                    session.getTaskType(),
                    session.getTaskField(),
                    session.getUserName()
                );

                ResponseStream<GenerateContentResponse> stream =
                    geminiStreamingService.streamResponse(client, session, systemPrompt, userMessage);

                for (GenerateContentResponse response : stream) {
                    String chunk = geminiStreamingService.extractText(response);

                    if (chunk != null && !chunk.isEmpty()) {
                        fullResponse.append(chunk);

                        emitter.send(SseEmitter.event()
                            .name("message")
                            .data(new ChatStreamChunkDto(chunk)));
                    }
                }

                session.addAssistantMessage(fullResponse.toString());
                chatSessionManager.updateSession(session);

                emitter.send(SseEmitter.event()
                    .name("done")
                    .data(new ChatDoneEventDto(true)));

                log.info("Streaming completed for userId: {}", userId);

            } catch (Exception e) {
                log.error("Streaming error for userId: {}", userId, e);
                try {
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                    log.error("Failed to complete emitter with error", ex);
                }
            }
        });
    }

    @Scheduled(fixedRate = 15000)
    public void sendHeartbeat() {
        Map<Long, SseEmitter> emitters = emitterRepository.getAllEmitters();

        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("heartbeat")
                    .data(""));
                log.debug("Heartbeat sent to userId: {}", userId);
            } catch (IOException e) {
                log.warn("Failed to send heartbeat to userId: {}, removing emitter", userId);
                emitterRepository.deleteById(userId);
            }
        });
    }
}
