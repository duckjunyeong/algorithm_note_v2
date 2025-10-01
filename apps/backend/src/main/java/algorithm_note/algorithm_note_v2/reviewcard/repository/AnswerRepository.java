package algorithm_note.algorithm_note_v2.reviewcard.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Answer 데이터 액세스 레이어
 */
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    /**
     * 특정 질문에 대한 모든 답변을 최신순으로 조회
     *
     * @param reviewQuestionId 복습 질문 ID
     * @return 답변 목록 (최신순)
     */
    List<Answer> findAllByReviewQuestion_ReviewQuestionIdOrderByCreatedAtDesc(Long reviewQuestionId);

    /**
     * 특정 복습 카드에 속한 모든 답변을 최신순으로 조회
     *
     * @param reviewCardId 복습 카드 ID
     * @return 답변 목록 (최신순)
     */
    List<Answer> findAllByReviewQuestion_ReviewCard_ReviewCardIdOrderByCreatedAtDesc(Long reviewCardId);
}
