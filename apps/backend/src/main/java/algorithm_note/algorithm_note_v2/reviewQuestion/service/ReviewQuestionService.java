package algorithm_note.algorithm_note_v2.reviewQuestion.service;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ReviewQuestionResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.exception.ReviewCardNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import algorithm_note.algorithm_note_v2.reviewQuestion.repository.ReviewQuestionRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ReviewQuestion 비즈니스 로직 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewQuestionService {

    private final ReviewQuestionRepository reviewQuestionRepository;
    private final ReviewCardRepository reviewCardRepository;

    public List<ReviewQuestionResponseDto> getQuestionsByReviewCardId(Long reviewCardId, User user) {
        log.info("Fetching questions for reviewCardId: {}, user: {}", reviewCardId, user.getId());

        // 1. ReviewCard 조회 및 소유자 검증
        ReviewCard reviewCard = reviewCardRepository.findById(reviewCardId)
                .orElseThrow(() -> new ReviewCardNotFoundException("복습 카드를 찾을 수 없습니다."));

        if (!reviewCard.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 복습 카드에 속한 질문만 조회할 수 있습니다.");
        }

        // 2. 질문 조회
        List<ReviewQuestion> questions = reviewQuestionRepository.findAllByReviewCard_ReviewCardId(reviewCardId);

        log.info("Found {} questions for reviewCardId: {}", questions.size(), reviewCardId);

        return questions.stream()
                .map(ReviewQuestionResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteQuestionsByIds(List<Long> questionIds) {
        if (questionIds == null || questionIds.isEmpty()) {
            log.info("No questions to delete - empty list provided");
            return;
        }

        log.info("Deleting {} questions with IDs: {}", questionIds.size(), questionIds);

        reviewQuestionRepository.deleteAllById(questionIds);

        log.info("Successfully deleted {} questions", questionIds.size());
    }
}
