package algorithm_note.algorithm_note_v2.reviewQuestion.controller;

import algorithm_note.algorithm_note_v2.global.service.GeminiClient;
import algorithm_note.algorithm_note_v2.reviewQuestion.dto.*;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewQuestionResponseDto;
import algorithm_note.algorithm_note_v2.reviewQuestion.service.ReviewQuestionService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for ReviewQuestion operations.
 * Provides endpoints for question creation and retrieval.
 */
@Slf4j
@RestController
@RequestMapping("/api/review-questions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewQuestionController {

    private final GeminiClient geminiClient;
    private final ReviewQuestionService reviewQuestionService;
    /**
     * 질문지를 생성합니다.
     *
     * @param request 채팅 메시지 요청 DTO
     * @return 생성된 질문 응답
     */
    @PostMapping("/create")
    public ResponseEntity<?> sendChatMessage(@Valid @RequestBody ChatMessageRequestDto request) throws JsonProcessingException {
        String message = request.getMessage();

        GeminiResponseDto geminiResponse = geminiClient.sendMessage(message);

        ChatMessageResponseDto response = ChatMessageResponseDto.of(
            geminiResponse.getResponse()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 특정 복습 카드의 모든 질문을 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param user 인증된 사용자
     * @return 질문 목록
     */
    @GetMapping("/review-card/{reviewCardId}")
    public ResponseEntity<List<ReviewQuestionResponseDto>> getQuestionsByReviewCard(
            @PathVariable Long reviewCardId,
            @AuthenticationPrincipal User user) {

        log.info("GET /api/review-questions/review-card/{} - user: {}", reviewCardId, user.getId());

        List<ReviewQuestionResponseDto> questions = reviewQuestionService.getQuestionsByReviewCardId(reviewCardId, user);

        log.info("Found {} questions for reviewCardId: {}", questions.size(), reviewCardId);

        return ResponseEntity.ok(questions);
    }
}