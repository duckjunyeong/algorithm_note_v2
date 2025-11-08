package algorithm_note.algorithm_note_v2.chat.controller;

import algorithm_note.algorithm_note_v2.chat.dto.ChatInitializeRequestDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatInitializeResponseDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatMessageRequestDto;
import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatSessionManager sessionManager;
    private final PromptService promptService;
    private final GeminiStreamingService geminiService;

    private static final long SSE_TIMEOUT = 600_000L;

    @PostMapping("/initialize")
    public ResponseEntity<ChatInitializeResponseDto> initializeChat(
            @Valid @RequestBody ChatInitializeRequestDto request) {

        log.info("Initializing chat session - taskType: {}, taskField: {}",
                request.getTaskType(), request.getTaskField());

        User currentUser = getCurrentUser();
        String userName = currentUser.getFirstName();

        ChatSession session = sessionManager.createSession(
                request.getTaskType(),
                request.getTaskField(),
                userName
        );

        log.info("Chat session initialized successfully - sessionId: {}, user: {}",
                session.getSessionId(), userName);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ChatInitializeResponseDto.success(session.getSessionId()));
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@Valid @RequestBody ChatMessageRequestDto request) {

        log.info("Streaming chat message - sessionId: {}", request.getSessionId());

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        new Thread(() -> {
            try {
                ChatSession session = sessionManager.getSession(request.getSessionId());
                Client client = sessionManager.getClient(request.getSessionId());

                String systemPrompt = promptService.formatPrompt(
                        session.getTaskType(),
                        session.getUserName(),
                        session.getTaskField()
                );

                sessionManager.addUserMessage(request.getSessionId(), request.getMessage());

                ResponseStream<GenerateContentResponse> responseStream = geminiService.streamResponse(
                        client,
                        session,
                        systemPrompt,
                        request.getMessage()
                );

                StringBuilder fullResponse = new StringBuilder();

                for (GenerateContentResponse chunk : responseStream) {
                    String text = geminiService.extractText(chunk);
                    if (!text.isEmpty()) {
                        fullResponse.append(text);
                        emitter.send(SseEmitter.event()
                                .data(text)
                                .name("message"));
                    }
                }

                responseStream.close();

                sessionManager.addAssistantMessage(request.getSessionId(), fullResponse.toString());

                emitter.send(SseEmitter.event()
                        .data("[DONE]")
                        .name("done"));
                emitter.complete();

                log.info("Chat streaming completed - sessionId: {}", request.getSessionId());

            } catch (IOException e) {
                log.error("SSE streaming error: {}", e.getMessage(), e);
                emitter.completeWithError(e);
            } catch (Exception e) {
                log.error("Chat processing error: {}", e.getMessage(), e);
                try {
                    emitter.send(SseEmitter.event()
                            .data("오류가 발생했습니다: " + e.getMessage())
                            .name("error"));
                    emitter.completeWithError(e);
                } catch (IOException ioException) {
                    log.error("Failed to send error event: {}", ioException.getMessage());
                }
            }
        }).start();

        return emitter;
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable String sessionId) {
        log.info("Deleting chat session: {}", sessionId);

        sessionManager.deleteSession(sessionId);

        log.info("Chat session deleted successfully: {}", sessionId);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new RuntimeException("유효하지 않은 사용자 정보입니다.");
        }

        return (User) principal;
    }
}
