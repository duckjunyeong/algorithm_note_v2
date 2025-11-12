package algorithm_note.algorithm_note_v2.reviewQuestion.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewQuestionRepository extends JpaRepository<ReviewQuestion, Long> {

    List<ReviewQuestion> findAllByReviewCardOrderByCreatedAtAsc(ReviewCard reviewCard);

    long countByReviewCard(ReviewCard reviewCard);

    void deleteAllByReviewCard(ReviewCard reviewCard);

    List<ReviewQuestion> findAllByReviewCard_ReviewCardId(Long reviewCardId);
}