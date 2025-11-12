package algorithm_note.algorithm_note_v2.reviewcard.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCardRepository extends JpaRepository<ReviewCard, Long> {

    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.user = :user " +
           "ORDER BY rc.createdAt DESC")
    List<ReviewCard> findAllByUserWithQuestions(@Param("user") User user);

    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.user = :user AND rc.isActive = :isActive " +
           "ORDER BY rc.createdAt DESC")
    List<ReviewCard> findAllByUserAndIsActiveWithQuestions(
            @Param("user") User user,
            @Param("isActive") Boolean isActive
    );

    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.reviewCardId = :reviewCardId AND rc.user = :user")
    Optional<ReviewCard> findByIdAndUserWithQuestions(
            @Param("reviewCardId") Long reviewCardId,
            @Param("user") User user
    );


    List<ReviewCard> findAllByUserAndImportanceOrderByCreatedAtDesc(User user, Integer importance);

    long countByUser(User user);

    long countByUserAndIsActive(User user, Boolean isActive);

    List<ReviewCard> findAllByIsActive(Boolean isActive);
}