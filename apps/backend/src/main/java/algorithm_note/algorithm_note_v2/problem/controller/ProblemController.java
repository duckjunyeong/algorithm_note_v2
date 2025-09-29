package algorithm_note.algorithm_note_v2.problem.controller;

import algorithm_note.algorithm_note_v2.global.service.GeminiClient;
import algorithm_note.algorithm_note_v2.problem.dto.*;
import algorithm_note.algorithm_note_v2.problem.service.ChatService;
import algorithm_note.algorithm_note_v2.problem.service.CodeAnalysisService;
import algorithm_note.algorithm_note_v2.problem.service.ProblemService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for problem registration operations.
 * Provides endpoints for URL-based and manual problem registration.
 */
@Slf4j
@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProblemController {

    private final ProblemService problemService;
    private final ChatService chatService;
    private final CodeAnalysisService codeAnalysisService;
    private final GeminiClient geminiClient;

    @PostMapping("/register/url")
    public ResponseEntity<ProblemResponseDto> registerProblemFromUrl(
            @Valid @RequestBody ProblemUrlRequestDto request,
            Authentication authentication) {

        log.info("Received URL registration request for: {}", request.getUrl());

        // Extract user from authentication principal (set by ClerkJwtAuthenticationFilter)
        User user = (User) authentication.getPrincipal();
        String userId = user.getClerkId();

        problemService.registerProblemFromUrl(request.getUrl(), userId);

        return ResponseEntity.ok(
                ProblemResponseDto.success("문제가 성공적으로 임시 등록되었습니다.")
        );
    }

    @PostMapping("/register/manual")
    public ResponseEntity<ProblemResponseDto> registerProblemFromManualInput(
            @Valid @RequestBody ProblemManualRequestDto request,
            Authentication authentication) {

        log.info("Received manual registration request for problem: {}", request.getTitle());

        // Extract user from authentication principal (set by ClerkJwtAuthenticationFilter)
        User user = (User) authentication.getPrincipal();
        String userId = user.getClerkId();

        problemService.registerProblemFromManualInput(request, userId);

        return ResponseEntity.ok(
                ProblemResponseDto.success("문제가 성공적으로 임시 등록되었습니다.")
        );
    }

    @PostMapping("/save")
    public ResponseEntity<ProblemResponseDto> saveProblemFromCache(
            Authentication authentication) {

        // Extract user from authentication principal (set by ClerkJwtAuthenticationFilter)
        User user = (User) authentication.getPrincipal();
        String userId = user.getClerkId();

        log.info("Saving cached problem for user: {}", userId);

        problemService.saveProblemFromCache(userId);

        return ResponseEntity.ok(
                ProblemResponseDto.success("문제가 성공적으로 저장되었습니다.")
        );
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> clearTemporaryData(Authentication authentication) {

        // Extract user from authentication principal (set by ClerkJwtAuthenticationFilter)
        User user = (User) authentication.getPrincipal();
        String userId = user.getClerkId();

        log.info("Clearing temporary data for user: {}", userId);

        problemService.clearUserTemporaryData(userId);

        // Return 204 No Content - operation completed successfully
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/code/analyze")
    public ResponseEntity<CodeAnalysisResponseDto> analyzeCode(
            @Valid @RequestBody CodeAnalysisRequestDto request,
            Authentication authentication) throws JsonProcessingException {

        log.info("Received code analysis request for language: {}", request.getLanguage());

        // Extract user from authentication principal (set by ClerkJwtAuthenticationFilter)
        User user = (User) authentication.getPrincipal();
        String userId = user.getClerkId();

        CodeAnalysisResponseDto result = codeAnalysisService.analyzeCode(request, userId);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> sendChatMessage(@Valid @RequestBody ChatMessageRequestDto request, @AuthenticationPrincipal User user) throws JsonProcessingException {
        String sessionId = user.getClerkId();
        String message = request.getMessage();

        if (message == null && request.getLogicalUnit() != null) {
            chatService.connectChatSession(sessionId, user, request.getLogicalUnit());
            String initialMessage = chatService.createInitialMessage(user, request.getLogicalUnit());

            ChatMessageResponseDto response = ChatMessageResponseDto.of(
                sessionId,
                null,
                initialMessage,
                false
            );

            return ResponseEntity.ok(response);
        }

        GeminiResponseDto geminiResponse = geminiClient.sendMessage(sessionId, message);

        ChatMessageResponseDto response = ChatMessageResponseDto.of(
            sessionId,
            message,
            geminiResponse.getResponse(),
            geminiResponse.isFinalResponse()
        );

        return ResponseEntity.ok(response);
    }
}