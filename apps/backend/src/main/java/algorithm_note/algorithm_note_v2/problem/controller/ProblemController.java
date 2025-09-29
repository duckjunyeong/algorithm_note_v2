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

    /**
     * Registers a problem by scraping from Baekjoon URL.
     * The scraped data is temporarily stored in Redis.
     *
     * @param request The URL registration request
     * @param authentication Spring Security authentication containing authenticated user
     * @return Success/failure response
     */
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

    /**
     * Registers a problem from manually entered data.
     * The problem data is temporarily stored in Redis.
     *
     * @param request The manual registration request
     * @param authentication Spring Security authentication containing authenticated user
     * @return Success/failure response
     */
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

    /**
     * Saves the temporarily cached problem to permanent storage.
     * This endpoint is called after the user completes code analysis.
     *
     * @param authentication Spring Security authentication containing authenticated user
     * @return Success/failure response
     */
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

    /**
     * Clears temporarily cached problem data for the authenticated user.
     * This endpoint is called when the user cancels problem registration process.
     *
     * @param authentication Spring Security authentication containing authenticated user
     * @return Success/failure response
     */
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

    /**
     * Analyzes algorithm code and extracts logical flow.
     * Retrieves problem data from Redis and sends to AI for analysis.
     *
     * @param request The code analysis request containing language and code
     * @param authentication Spring Security authentication containing authenticated user
     * @return Analysis result with logical units
     */
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
        String sessionId = request.getSessionId();
        String message = request.getMessage();
        String blockId = request.getBlockId();

        if (message == null && blockId != null) {
            String initialMessage = chatService.createInitialChatMessage(blockId, sessionId, user);

            ChatMessageResponseDto response = ChatMessageResponseDto.of(
                sessionId,
                null,  // 첫 요청은 사용자 메시지가 없음
                initialMessage,
                false  // 첫 메시지는 final response가 아님
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