package algorithm_note.algorithm_note_v2.chat.controller;

import algorithm_note.algorithm_note_v2.chat.dto.ChatDoneEventDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatMessageRequestDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatSessionResponseDto;
import algorithm_note.algorithm_note_v2.chat.dto.ChatStreamChunkDto;
import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import algorithm_note.algorithm_note_v2.chat.exception.EmitterNotFoundException;
import algorithm_note.algorithm_note_v2.chat.repository.EmitterRepository;
import algorithm_note.algorithm_note_v2.chat.service.ChatSessionManager;
import algorithm_note.algorithm_note_v2.chat.service.GeminiStreamingService;
import algorithm_note.algorithm_note_v2.chat.service.PromptService;
import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.google.genai.Client;
import com.google.genai.ResponseStream;
import com.google.genai.types.GenerateContentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final EmitterRepository emitterRepository;
    private final ChatSessionManager chatSessionManager;
    private final GeminiStreamingService geminiStreamingService;
    private final PromptService promptService;
    private final ReviewCardRepository reviewCardRepository;

    private static final long SSE_TIMEOUT = 60 * 60 * 1000L;

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

            // Automatically send initial guidance message after connection
            ChatSession session = chatSessionManager.getSessionByUserId(userId);
            CompletableFuture.runAsync(() -> {
                try {
                    String sessionId = "user-" + userId;
                    Client client = chatSessionManager.getClient(sessionId);

                    String systemPrompt = promptService.formatPrompt(
                        taskType,
                        userName,
                        taskField
                    );

                    String initMessage = "질문 생성을 시작합니다.";
                    session.addUserMessage(initMessage);
                    chatSessionManager.updateSession(session);

                    ResponseStream<GenerateContentResponse> stream =
                        geminiStreamingService.streamResponse(client, session, systemPrompt, initMessage);

                    StringBuilder fullResponse = new StringBuilder();
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

                    log.info("Initial guidance message automatically sent for userId: {}", userId);

                } catch (Exception e) {
                    log.error("Failed to send initial guidance message for userId: {}", userId, e);
                    try {
                        emitter.completeWithError(e);
                    } catch (Exception ex) {
                        log.error("Failed to complete emitter with error", ex);
                    }
                }
            });

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
                    session.getUserName(),
                    session.getTaskField()
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

    @GetMapping(value = "/test/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeTest(
        @RequestParam Long reviewCardId,
        @RequestParam String tutorLevel,
        @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();
        String userName = user.getFirstName() + " " + user.getLastName();

        log.info("SSE test subscribe requested - userId: {}, reviewCardId: {}, tutorLevel: {}",
            userId, reviewCardId, tutorLevel);

        ReviewCard reviewCard = reviewCardRepository
            .findByIdAndUserWithQuestions(reviewCardId, user)
            .orElseThrow(() -> new IllegalArgumentException("ReviewCard not found: " + reviewCardId));

        List<ChatSession.ReviewQuestionInfo> questionInfos = reviewCard.getReviewQuestions().stream()
            .map(q -> ChatSession.ReviewQuestionInfo.builder()
                .reviewQuestionId(q.getReviewQuestionId())
                .questionText(q.getQuestionText())
                .build())
            .collect(Collectors.toList());

        log.info("Loaded {} questions for reviewCardId: {}", questionInfos.size(), reviewCardId);

        emitterRepository.deleteById(userId);
        try {
            chatSessionManager.deleteSessionByUserId(userId);
        } catch (Exception e) {
            log.debug("No existing session to delete for userId: {}", userId);
        }

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitterRepository.save(userId, emitter);
        emitterRepository.configureCallbacks(userId, emitter);

        chatSessionManager.createTestSession(userId, tutorLevel, userName, reviewCardId, questionInfos);

        try {
            Map<String, Object> data = new HashMap<>();
            data.put("sessionId", "user-" + userId);
            data.put("reviewCardId", reviewCardId);
            data.put("questionCount", questionInfos.size());
            data.put("message", "Test session connected successfully");

            emitter.send(SseEmitter.event()
                .name("connected")
                .data(data));

            log.info("SSE test connection established for userId: {}", userId);

            // Automatically send first question after connection
            ChatSession session = chatSessionManager.getSessionByUserId(userId);
            CompletableFuture.runAsync(() -> {
                try {
                    String sessionId = "user-" + userId;
                    Client client = chatSessionManager.getClient(sessionId);

                    List<String> questionTexts = questionInfos.stream()
                        .map(ChatSession.ReviewQuestionInfo::getQuestionText)
                        .collect(Collectors.toList());

                    String systemPrompt = promptService.formatTestPrompt(
                        tutorLevel,
                        userName,
                        questionTexts
                    );

                    String initMessage = "테스트를 시작합니다.";
                    session.addUserMessage(initMessage);
                    chatSessionManager.updateSession(session);

                    ResponseStream<GenerateContentResponse> stream =
                        geminiStreamingService.streamResponse(client, session, systemPrompt, initMessage);

                    StringBuilder fullResponse = new StringBuilder();
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

                    log.info("First question automatically sent for userId: {}", userId);

                } catch (Exception e) {
                    log.error("Failed to send initial question for userId: {}", userId, e);
                    try {
                        emitter.completeWithError(e);
                    } catch (Exception ex) {
                        log.error("Failed to complete emitter with error", ex);
                    }
                }
            });

        } catch (IOException e) {
            log.error("Failed to send connected event", e);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    @PostMapping("/test/message")
    public void sendTestMessage(
        @Valid @RequestBody ChatMessageRequestDto request,
        @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();
        String userMessage = request.getMessage();

        log.info("Test message received from userId: {}", userId);

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

                List<String> questionTexts = session.getReviewQuestions().stream()
                    .map(ChatSession.ReviewQuestionInfo::getQuestionText)
                    .collect(Collectors.toList());

                String systemPrompt = promptService.formatTestPrompt(
                    session.getTutorLevel(),
                    session.getUserName(),
                    questionTexts
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

                log.info("Test streaming completed for userId: {}", userId);

            } catch (Exception e) {
                log.error("Test streaming error for userId: {}", userId, e);
                try {
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                    log.error("Failed to complete emitter with error", ex);
                }
            }
        });
    }

    @GetMapping("/session/review-card/{reviewCardId}")
    public ResponseEntity<ChatSessionResponseDto> getReviewCardSession(
        @PathVariable Long reviewCardId,
        @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();
        log.info("Getting chat session for reviewCardId: {} and userId: {}", reviewCardId, userId);

        ChatSession session = chatSessionManager.getSessionByUserId(userId);
        ChatSessionResponseDto response = ChatSessionResponseDto.from(session);

        log.info("Successfully retrieved chat session for reviewCardId: {}", reviewCardId);
        return ResponseEntity.ok(response);
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
