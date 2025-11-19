package algorithm_note.algorithm_note_v2.activity.repository;

import algorithm_note.algorithm_note_v2.activity.domain.Activity;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Optional<Activity> findByUserAndActivityDate(User user, LocalDate activityDate);

    @Query("SELECT a FROM Activity a WHERE a.user = :user AND a.activityDate BETWEEN :startDate AND :endDate ORDER BY a.activityDate DESC")
    List<Activity> findByUserAndActivityDateBetween(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT a FROM Activity a WHERE a.user = :user ORDER BY a.activityDate DESC")
    List<Activity> findAllByUserOrderByActivityDateDesc(@Param("user") User user);

    @Query("SELECT a FROM Activity a WHERE a.user = :user AND a.activityDate <= :date ORDER BY a.activityDate DESC")
    List<Activity> findByUserAndActivityDateBeforeOrEqual(
            @Param("user") User user,
            @Param("date") LocalDate date
    );

    long countByUser(User user);

    boolean existsByUserAndActivityDate(User user, LocalDate activityDate);
}
