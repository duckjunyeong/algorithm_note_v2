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

@Slf4j
@RestController
@RequestMapping("/api/review-questions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewQuestionController {

    private final GeminiClient geminiClient;
    private final ReviewQuestionService reviewQuestionService;

    @PostMapping("/create")
    public ResponseEntity<?> sendChatMessage(@Valid @RequestBody ChatMessageRequestDto request) throws JsonProcessingException {
        String message = request.getMessage();

        GeminiResponseDto geminiResponse = geminiClient.sendMessage(message);

        ChatMessageResponseDto response = ChatMessageResponseDto.of(
            geminiResponse.getResponse()
        );

        return ResponseEntity.ok(response);
    }

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