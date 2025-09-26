package algorithm_note.algorithm_note_v2.problem.controller;

import algorithm_note.algorithm_note_v2.problem.dto.ProblemManualRequestDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemResponseDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemUrlRequestDto;
import algorithm_note.algorithm_note_v2.problem.service.ProblemService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}