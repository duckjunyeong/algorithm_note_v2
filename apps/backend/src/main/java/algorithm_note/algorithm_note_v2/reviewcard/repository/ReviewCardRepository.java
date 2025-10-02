package algorithm_note.algorithm_note_v2.reviewcard.repository;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ReviewCard JPA Repository
 *
 * 복습 카드 데이터 액세스를 위한 JPA 레포지토리
 */
@Repository
public interface ReviewCardRepository extends JpaRepository<ReviewCard, Long> {

    /**
     * 특정 사용자의 모든 복습 카드를 조회합니다.
     * 연관된 질문들도 함께 페치하여 N+1 문제를 방지합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @return 사용자의 복습 카드 목록
     */
    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.user = :user " +
           "ORDER BY rc.createdAt DESC")
    List<ReviewCard> findAllByUserWithQuestions(@Param("user") User user);

    /**
     * 특정 사용자의 활성 상태별 복습 카드를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @param isActive 활성 상태 (true: 백로그, false: 완료)
     * @return 해당 상태의 복습 카드 목록
     */
    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.user = :user AND rc.isActive = :isActive " +
           "ORDER BY rc.createdAt DESC")
    List<ReviewCard> findAllByUserAndIsActiveWithQuestions(
            @Param("user") User user,
            @Param("isActive") Boolean isActive
    );

    /**
     * 특정 사용자의 복습 카드를 ID로 조회합니다.
     *
     * @param reviewCardId 복습 카드 ID
     * @param user 소유자 사용자
     * @return 복습 카드 (존재하지 않으면 Empty)
     */
    @Query("SELECT rc FROM ReviewCard rc " +
           "LEFT JOIN FETCH rc.reviewQuestions " +
           "WHERE rc.reviewCardId = :reviewCardId AND rc.user = :user")
    Optional<ReviewCard> findByIdAndUserWithQuestions(
            @Param("reviewCardId") Long reviewCardId,
            @Param("user") User user
    );


    /**
     * 특정 사용자의 중요도별 복습 카드를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @param importance 중요도
     * @return 해당 중요도의 복습 카드 목록
     */
    List<ReviewCard> findAllByUserAndImportanceOrderByCreatedAtDesc(User user, Integer importance);

    /**
     * 특정 사용자의 복습 카드 개수를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @return 복습 카드 총 개수
     */
    long countByUser(User user);

    /**
     * 특정 사용자의 활성 상태별 복습 카드 개수를 조회합니다.
     *
     * @param user 복습 카드를 조회할 사용자
     * @param isActive 활성 상태
     * @return 해당 상태의 복습 카드 개수
     */
    long countByUserAndIsActive(User user, Boolean isActive);
}