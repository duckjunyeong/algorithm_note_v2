package algorithm_note.algorithm_note_v2.reviewcard.controller;

import algorithm_note.algorithm_note_v2.reviewcard.dto.*;
import algorithm_note.algorithm_note_v2.reviewcard.service.ReviewCardService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 복습 카드 REST API Controller
 *
 * 복습 카드 생성, 조회, 수정, 삭제 등의 API를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/reviewCard")
@RequiredArgsConstructor
public class ReviewCardController {

    private final ReviewCardService reviewCardService;

    /**
     * 복습 카드를 생성합니다.
     *
     * @param requestDto 복습 카드 생성 요청 DTO
     * @return 생성된 복습 카드 응답
     */
    @PostMapping("/create")
    public ResponseEntity<ReviewCardCreateResponseDto> createReviewCard(
            @Valid @RequestBody ReviewCardCreateRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        log.info("Creating review card with title: {}", requestDto.getTitle());

        ReviewCardCreateResponseDto response = reviewCardService.createReviewCard(requestDto, currentUser);

        log.info("Successfully created review card with ID: {}", response.getReviewCardId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 인증된 사용자의 모든 복습 카드를 조회합니다.
     *
     * @return 복습 카드 목록
     */
    @GetMapping
    public ResponseEntity<List<ReviewCardResponseDto>> getAllReviewCards(@AuthenticationPrincipal User currentUser) {
        log.info("Fetching all review cards for authenticated user");

        List<ReviewCardResponseDto> reviewCards = reviewCardService.getAllReviewCardsByUser(currentUser);

        log.info("Found {} review cards for user", reviewCards.size());

        log.info("ReviewCard: {}", reviewCards.get(0).getReviewQuestions());
        return ResponseEntity.ok(reviewCards);
    }

    /**
     * 특정 복습 카드의 상세 정보를 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @return 복습 카드 상세 정보
     */
    @GetMapping("/{reviewCardId}")
    public ResponseEntity<ReviewCardResponseDto> getReviewCard(
            @PathVariable Long reviewCardId,
            @AuthenticationPrincipal User currentUser) {

        log.info("Fetching review card with ID: {}", reviewCardId);
        ReviewCardResponseDto reviewCard = reviewCardService.getReviewCardById(reviewCardId, currentUser);

        return ResponseEntity.ok(reviewCard);
    }

    /**
     * 복습 카드의 상태를 업데이트합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param requestDto 상태 업데이트 요청 DTO
     * @return 성공 응답
     */
    @PatchMapping("/{reviewCardId}/status")
    public ResponseEntity<Void> updateReviewCardStatus(
            @PathVariable Long reviewCardId,
            @Valid @RequestBody ReviewCardUpdateStatusRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        log.info("Updating review card status - ID: {}, isActive: {}",
                reviewCardId, requestDto.getIsActive());
        reviewCardService.updateReviewCardStatus(reviewCardId, requestDto.getIsActive(), currentUser);

        log.info("Successfully updated review card status - ID: {}", reviewCardId);

        return ResponseEntity.ok().build();
    }

    /**
     * 복습 카드의 복습 횟수를 증가시킵니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @return 성공 응답
     */
    @PostMapping("/{reviewCardId}/review")
    public ResponseEntity<Void> incrementReviewCount(@PathVariable Long reviewCardId, @AuthenticationPrincipal User currentUser) {
        log.info("Incrementing review count for card ID: {}", reviewCardId);
        reviewCardService.incrementReviewCount(reviewCardId, currentUser);

        log.info("Successfully incremented review count for card ID: {}", reviewCardId);

        return ResponseEntity.ok().build();
    }

    /**
     * 복습 카드를 삭제합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @return 성공 응답
     */
    @DeleteMapping("/{reviewCardId}")
    public ResponseEntity<Void> deleteReviewCard(@PathVariable Long reviewCardId, @AuthenticationPrincipal User currentUser) {
        log.info("Deleting review card with ID: {}", reviewCardId);
        reviewCardService.deleteReviewCard(reviewCardId, currentUser);

        log.info("Successfully deleted review card with ID: {}", reviewCardId);

        return ResponseEntity.noContent().build();
    }

    /**
     * 활성 상태별 복습 카드를 조회합니다.
     *
     * @param isActive 활성 상태 (true: 백로그, false: 완료)
     * @return 해당 상태의 복습 카드 목록
     */
    @GetMapping("/status")
    public ResponseEntity<List<ReviewCardResponseDto>> getReviewCardsByStatus(
            @RequestParam Boolean isActive,
            @AuthenticationPrincipal User currentUser) {

        log.info("Fetching review cards by status: {}", isActive);
        List<ReviewCardResponseDto> reviewCards = reviewCardService.getReviewCardsByStatus(currentUser, isActive);

        log.info("Found {} review cards with status: {}", reviewCards.size(), isActive);

        return ResponseEntity.ok(reviewCards);
    }

    /**
     * 복습 카드 통계를 조회합니다.
     *
     * @return 복습 카드 통계 정보
     */
    @GetMapping("/stats")
    public ResponseEntity<ReviewCardService.ReviewCardStatsDto> getReviewCardStats(@AuthenticationPrincipal User currentUser) {
        log.info("Fetching review card stats for authenticated user");
        ReviewCardService.ReviewCardStatsDto stats = reviewCardService.getReviewCardStats(currentUser);

        return ResponseEntity.ok(stats);
    }

    /**
     * 비활성화된 복습 카드의 질문과 답변 목록을 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @return 질문별 답변 목록이 포함된 응답
     */
    @GetMapping("/{reviewCardId}/results")
    public ResponseEntity<ReviewCardResultResponseDto> getReviewCardResults(
            @PathVariable Long reviewCardId,
            @AuthenticationPrincipal User currentUser) {

        log.info("Fetching review card results for ID: {}", reviewCardId);

        ReviewCardResultResponseDto results = reviewCardService.getReviewCardResults(reviewCardId, currentUser);

        log.info("Successfully fetched review card results - ID: {}", reviewCardId);

        return ResponseEntity.ok(results);
    }

    /**
     * 복습 테스트 결과를 저장합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param requestDto 업데이트 요청 DTO
     * @return 성공 응답
     */
    @PutMapping("/{reviewCardId}/result")
    public ResponseEntity<Void> updateReviewResult(
            @PathVariable Long reviewCardId,
            @Valid @RequestBody ReviewCardUpdateRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        reviewCardService.updateReviewResult(reviewCardId, requestDto, currentUser);

        log.info("Successfully updated review result - ID: {}", reviewCardId);

        return ResponseEntity.ok().build();
    }
}