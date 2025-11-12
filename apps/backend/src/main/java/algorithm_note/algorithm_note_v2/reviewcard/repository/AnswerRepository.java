package algorithm_note.algorithm_note_v2.reviewcard.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findAllByReviewQuestion_ReviewQuestionIdOrderByCreatedAtDesc(Long reviewQuestionId);

    List<Answer> findAllByReviewQuestion_ReviewCard_ReviewCardIdOrderByCreatedAtDesc(Long reviewCardId);
}
