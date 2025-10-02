package algorithm_note.algorithm_note_v2.reviewcard.service;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.category.service.CategoryService;
import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardCreateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardCreateResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardUpdateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.exception.ReviewCardNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import algorithm_note.algorithm_note_v2.reviewQuestion.repository.ReviewQuestionRepository;
import algorithm_note.algorithm_note_v2.reviewQuestion.service.ReviewQuestionService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 복습 카드 비즈니스 로직 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewCardService {

    private final ReviewCardRepository reviewCardRepository;
    private final ReviewQuestionRepository reviewQuestionRepository;
    private final ReviewQuestionService reviewQuestionService;
    private final CategoryService categoryService;

    /**
     * 복습 카드를 생성합니다.
     *
     * @param requestDto 복습 카드 생성 요청 DTO
     * @param user 카드를 생성할 사용자
     * @return 생성된 복습 카드의 응답 DTO
     */
    @Transactional
    public ReviewCardCreateResponseDto createReviewCard(ReviewCardCreateRequestDto requestDto, User user) {
        log.info("Creating review card for user: {}, title: {}", user.getId(), requestDto.getTitle());

        try {
            // 1. Category 조회 및 검증
            Category category = categoryService.findCategoryByIdAndUser(requestDto.getCategoryId(), user);

            // 2. ReviewCard 생성
            ReviewCard reviewCard = ReviewCard.builder()
                    .user(user)
                    .title(requestDto.getTitle())
                    .category(category)
                    .importance(requestDto.getImportance())
                    .reviewCycle(requestDto.getReviewCycle())
                    .build();

            // 3. ReviewCard 저장
            ReviewCard savedReviewCard = reviewCardRepository.save(reviewCard);

            // 4. ReviewQuestion 생성 및 저장
            List<ReviewQuestion> reviewQuestions = requestDto.getQuestions().stream()
                    .map(questionDto -> ReviewQuestion.createQuestion(savedReviewCard, questionDto.getText()))
                    .collect(Collectors.toList());

            reviewQuestionRepository.saveAll(reviewQuestions);

            log.info("Successfully created review card with ID: {} and {} questions",
                    savedReviewCard.getReviewCardId(), reviewQuestions.size());

            return ReviewCardCreateResponseDto.success(savedReviewCard.getReviewCardId());

        } catch (Exception e) {
            log.error("Failed to create review card for user: {}", user.getId(), e);
            throw new RuntimeException("복습 카드 생성에 실패했습니다.", e);
        }
    }

    /**
     * 사용자의 모든 복습 카드를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @return 복습 카드 목록
     */
    public List<ReviewCardResponseDto> getAllReviewCardsByUser(User user) {
        log.info("Fetching all review cards for user: {}", user.getId());

        List<ReviewCard> reviewCards = reviewCardRepository.findAllByUserWithQuestions(user);

        log.info("Found {} review cards for user: {}", reviewCards.size(), user.getId());

        return reviewCards.stream()
                .map(ReviewCardResponseDto::fromWithoutQuestions) // 성능을 위해 질문 정보는 제외
                .collect(Collectors.toList());
    }

    /**
     * 특정 복습 카드를 상세 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param user 소유자 사용자
     * @return 복습 카드 상세 정보
     */
    public ReviewCardResponseDto getReviewCardById(Long reviewCardId, User user) {
        log.info("Fetching review card with ID: {} for user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        return ReviewCardResponseDto.from(reviewCard);
    }

    /**
     * 복습 카드의 상태를 업데이트합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param isActive 활성 상태 (true: 백로그, false: 완료)
     * @param user 소유자 사용자
     */
    @Transactional
    public void updateReviewCardStatus(Long reviewCardId, Boolean isActive, User user) {
        log.info("Updating review card status - ID: {}, isActive: {}, user: {}",
                reviewCardId, isActive, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        reviewCard.updateStatus(isActive);
        reviewCardRepository.save(reviewCard);

        log.info("Successfully updated review card status - ID: {}", reviewCardId);
    }

    /**
     * 복습 카드의 복습 횟수를 증가시킵니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param user 소유자 사용자
     */
    @Transactional
    public void incrementReviewCount(Long reviewCardId, User user) {
        log.info("Incrementing review count for card ID: {}, user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        reviewCard.incrementReviewCount();
        reviewCardRepository.save(reviewCard);

        log.info("Successfully incremented review count for card ID: {}", reviewCardId);
    }

    /**
     * 복습 카드를 삭제합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param user 소유자 사용자
     */
    @Transactional
    public void deleteReviewCard(Long reviewCardId, User user) {
        log.info("Deleting review card - ID: {}, user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        // CASCADE 설정으로 인해 관련 질문들도 자동 삭제됨
        reviewCardRepository.delete(reviewCard);

        log.info("Successfully deleted review card - ID: {}", reviewCardId);
    }

    /**
     * 사용자의 활성 상태별 복습 카드를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @param isActive 활성 상태
     * @return 해당 상태의 복습 카드 목록
     */
    public List<ReviewCardResponseDto> getReviewCardsByStatus(User user, Boolean isActive) {
        log.info("Fetching review cards by status - user: {}, isActive: {}", user.getId(), isActive);

        List<ReviewCard> reviewCards = reviewCardRepository.findAllByUserAndIsActiveWithQuestions(user, isActive);

        log.info("Found {} review cards with status {} for user: {}",
                reviewCards.size(), isActive, user.getId());

        return reviewCards.stream()
                .map(ReviewCardResponseDto::fromWithoutQuestions)
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 복습 카드 통계를 조회합니다.
     *
     * @param user 통계를 조회할 사용자
     * @return 통계 정보
     */
    public ReviewCardStatsDto getReviewCardStats(User user) {
        log.info("Fetching review card stats for user: {}", user.getId());

        long totalCount = reviewCardRepository.countByUser(user);
        long activeCount = reviewCardRepository.countByUserAndIsActive(user, true);
        long completedCount = reviewCardRepository.countByUserAndIsActive(user, false);

        return ReviewCardStatsDto.builder()
                .totalCount(totalCount)
                .activeCount(activeCount)
                .completedCount(completedCount)
                .build();
    }

    /**
     * 복습 테스트 결과를 저장합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param requestDto 업데이트 요청 DTO
     * @param user 소유자 사용자
     */
    @Transactional
    public void updateReviewResult(Long reviewCardId, ReviewCardUpdateRequestDto requestDto, User user) {
        log.info("Updating review result - cardId: {}, user: {}", reviewCardId, user.getId());

        // 1. ReviewCard 조회 및 권한 검증
        ReviewCard card = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        // 2. 질문별 테스트 결과 반영
        List<ReviewCardUpdateRequestDto.QuestionUpdateDto> questionUpdates =
                requestDto.getQuestionUpdates() != null ? requestDto.getQuestionUpdates() : Collections.emptyList();

        for (ReviewCardUpdateRequestDto.QuestionUpdateDto update : questionUpdates) {
            ReviewQuestion question = card.getReviewQuestions().stream()
                    .filter(q -> q.getReviewQuestionId().equals(update.getReviewQuestionId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "질문을 찾을 수 없습니다: " + update.getReviewQuestionId()));

            question.updateTestResult(update.getSuccessCount(), update.getFailCount());
        }

        // 3. 카드 설정 변경
        Category newCategory = null;
        if (requestDto.getCategoryId() != null) {
            newCategory = categoryService.findCategoryByIdAndUser(requestDto.getCategoryId(), user);
        }

        card.updateCardInfo(
                requestDto.getTitle(),
                newCategory,
                requestDto.getImportance(),
                requestDto.getReviewCycle()
        );

        // 4. 상태 변경 (테스트 완료)
        card.updateStatus(requestDto.getIsActive());

        // 5. 질문 삭제 처리
        List<Long> deletedIds = requestDto.getDeletedQuestionIds() != null
                ? requestDto.getDeletedQuestionIds()
                : Collections.emptyList();

        if (!deletedIds.isEmpty()) {
            reviewQuestionService.deleteQuestionsByIds(deletedIds);
        }

        // 6. 모든 질문이 삭제되었는지 확인
        long remainingQuestionsCount = card.getReviewQuestions().stream()
                .filter(q -> !deletedIds.contains(q.getReviewQuestionId()))
                .count();

        if (remainingQuestionsCount == 0) {
            // 모든 질문 삭제 시 카드도 삭제
            log.info("Deleting card {} - all questions deleted", reviewCardId);
            reviewCardRepository.delete(card);
        } else {
            // 카드 저장
            log.info("Saving card {} - {} questions remaining", reviewCardId, remainingQuestionsCount);
            reviewCardRepository.save(card);
        }

        log.info("Successfully updated review result - cardId: {}", reviewCardId);
    }

    /**
     * 복습 카드 통계 DTO
     */
    @lombok.Getter
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ReviewCardStatsDto {
        private long totalCount;
        private long activeCount;
        private long completedCount;
    }
}