package algorithm_note.algorithm_note_v2.reviewcard.domain;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "review_card")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_card_id")
    private Long reviewCardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer importance;

    @Column(name = "review_cycle", nullable = false)
    private Integer reviewCycle;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "review_count", nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(name = "success_rate")
    @Builder.Default
    private Double successRate = 0.0;

    @Column(name = "url", length = 500)
    private String url;

    @Column(name = "task_type", length = 50, nullable = false)
    private String taskType;

    @Column(name = "task_field", length = 100)
    private String taskField;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "reviewCard", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<ReviewQuestion> reviewQuestions = new ArrayList<>();

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

    public void updateStatus(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementReviewCount() {
        this.reviewCount++;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateCardInfo(String title, Category category, Integer importance, Integer reviewCycle, String url) {
        if (title != null) this.title = title;
        if (category != null) this.category = category;
        if (importance != null) this.importance = importance;
        if (reviewCycle != null) this.reviewCycle = reviewCycle;
        if (url != null) this.url = url;
        this.updatedAt = LocalDateTime.now();
    }

    public void recalculateSuccessRate() {
        if (this.reviewQuestions == null || this.reviewQuestions.isEmpty()) {
            this.successRate = 0.0;
            return;
        }

        int totalCount = 0;
        int totalSuccess = 0;

        for (ReviewQuestion question : this.reviewQuestions) {
            totalCount += question.getSuccessCount() + question.getFailCount();
            totalSuccess += question.getSuccessCount();
        }

        this.successRate = totalCount == 0 ? 0.0 : (totalSuccess * 100.0) / totalCount;
        this.updatedAt = LocalDateTime.now();
    }
}