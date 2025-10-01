package algorithm_note.algorithm_note_v2.reviewQuestion.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ReviewQuestion JPA Repository
 *
 * 복습 질문 데이터 액세스를 위한 JPA 레포지토리
 */
@Repository
public interface ReviewQuestionRepository extends JpaRepository<ReviewQuestion, Long> {

    /**
     * 특정 복습 카드의 모든 질문을 조회합니다.
     *
     * @param reviewCard 복습 카드
     * @return 해당 복습 카드의 질문 목록
     */
    List<ReviewQuestion> findAllByReviewCardOrderByCreatedAtAsc(ReviewCard reviewCard);

    /**
     * 특정 복습 카드의 질문 개수를 조회합니다.
     *
     * @param reviewCard 복습 카드
     * @return 질문 개수
     */
    long countByReviewCard(ReviewCard reviewCard);

    /**
     * 특정 복습 카드의 모든 질문을 삭제합니다.
     *
     * @param reviewCard 복습 카드
     */
    void deleteAllByReviewCard(ReviewCard reviewCard);

    /**
     * 복습 카드 ID로 모든 질문을 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @return 질문 목록
     */
    List<ReviewQuestion> findAllByReviewCard_ReviewCardId(Long reviewCardId);
}