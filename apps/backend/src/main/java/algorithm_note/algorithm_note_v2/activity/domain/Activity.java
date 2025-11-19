package algorithm_note.algorithm_note_v2.activity.domain;

import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_activity",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "activity_date"})
    },
    indexes = {
        @Index(name = "idx_user_activity_date", columnList = "user_id, activity_date")
    }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long activityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "review_cards_completed", nullable = false)
    @Builder.Default
    private Integer reviewCardsCompleted = 0;

    @Column(name = "questions_answered", nullable = false)
    @Builder.Default
    private Integer questionsAnswered = 0;

    @Column(name = "study_time_minutes", nullable = false)
    @Builder.Default
    private Integer studyTimeMinutes = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementReviewCardsCompleted() {
        this.reviewCardsCompleted++;
        this.updatedAt = LocalDateTime.now();
    }

    public void addQuestionsAnswered(int count) {
        this.questionsAnswered += count;
        this.updatedAt = LocalDateTime.now();
    }

    public void addStudyTime(int minutes) {
        this.studyTimeMinutes += minutes;
        this.updatedAt = LocalDateTime.now();
    }
}
