package algorithm_note.algorithm_note_v2.reviewcard.service;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.category.service.CategoryService;
import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardCreateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardCreateResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardResultResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewCardUpdateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.exception.ReviewCardNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.AnswerRepository;
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
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewCardService {

    private final ReviewCardRepository reviewCardRepository;
    private final ReviewQuestionRepository reviewQuestionRepository;
    private final AnswerRepository answerRepository;
    private final ReviewQuestionService reviewQuestionService;
    private final CategoryService categoryService;

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
                    .url(requestDto.getUrl())
                    .taskType(requestDto.getTaskType())
                    .taskField(requestDto.getTaskField())
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

    public List<ReviewCardResponseDto> getAllReviewCardsByUser(User user) {
        log.info("Fetching all review cards for user: {}", user.getId());

        List<ReviewCard> reviewCards = reviewCardRepository.findAllByUserWithQuestions(user);

        log.info("Found {} review cards for user: {}", reviewCards.size(), user.getId());

        return reviewCards.stream()
                .map(ReviewCardResponseDto::fromWithoutQuestions) // 성능을 위해 질문 정보는 제외
                .collect(Collectors.toList());
    }

    public ReviewCardResponseDto getReviewCardById(Long reviewCardId, User user) {
        log.info("Fetching review card with ID: {} for user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        return ReviewCardResponseDto.from(reviewCard);
    }

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

    @Transactional
    public void incrementReviewCount(Long reviewCardId, User user) {
        log.info("Incrementing review count for card ID: {}, user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        reviewCard.incrementReviewCount();
        reviewCardRepository.save(reviewCard);

        log.info("Successfully incremented review count for card ID: {}", reviewCardId);
    }

    @Transactional
    public void deleteReviewCard(Long reviewCardId, User user) {
        log.info("Deleting review card - ID: {}, user: {}", reviewCardId, user.getId());

        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        // CASCADE 설정으로 인해 관련 질문들도 자동 삭제됨
        reviewCardRepository.delete(reviewCard);

        log.info("Successfully deleted review card - ID: {}", reviewCardId);
    }

    public List<ReviewCardResponseDto> getReviewCardsByStatus(User user, Boolean isActive) {
        log.info("Fetching review cards by status - user: {}, isActive: {}", user.getId(), isActive);

        List<ReviewCard> reviewCards = reviewCardRepository.findAllByUserAndIsActiveWithQuestions(user, isActive);

        log.info("Found {} review cards with status {} for user: {}",
                reviewCards.size(), isActive, user.getId());

        return reviewCards.stream()
                .map(ReviewCardResponseDto::fromWithoutQuestions)
                .collect(Collectors.toList());
    }

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

    public ReviewCardResultResponseDto getReviewCardResults(Long reviewCardId, User user) {
        log.info("Fetching review card results - cardId: {}, user: {}", reviewCardId, user.getId());

        // 1. ReviewCard 조회 및 권한 검증
        ReviewCard reviewCard = reviewCardRepository.findByIdAndUserWithQuestions(reviewCardId, user)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        List<ReviewQuestion> reviewQuestions = reviewCard.getReviewQuestions();

        // 2. 각 질문에 대한 답변 조회 (최신순 정렬)
        Map<Long, List<Answer>> answersMap = reviewQuestions.stream()
                .collect(Collectors.toMap(
                        ReviewQuestion::getReviewQuestionId,
                        question -> answerRepository
                                .findAllByReviewQuestion_ReviewQuestionIdOrderByCreatedAtDesc(
                                        question.getReviewQuestionId()
                                )
                ));

        log.info("Found {} questions with answers for card: {}", reviewQuestions.size(), reviewCardId);

        // 3. DTO 변환 및 반환
        return ReviewCardResultResponseDto.from(reviewQuestions, answersMap);
    }

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
                requestDto.getReviewCycle(),
                requestDto.getUrl()
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