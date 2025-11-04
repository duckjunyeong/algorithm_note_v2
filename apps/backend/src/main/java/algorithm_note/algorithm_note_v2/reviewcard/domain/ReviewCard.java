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

/**
 * ReviewCard entity representing review cards for spaced repetition learning.
 *
 * 복습 카드 엔티티 - 간격 반복 학습을 위한 복습 카드를 나타냅니다.
 */
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

    /**
     * 복습 카드 상태를 업데이트합니다.
     *
     * @param isActive 활성화 상태 (true: 백로그, false: 완료)
     */
    public void updateStatus(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 복습 횟수를 증가시킵니다.
     */
    public void incrementReviewCount() {
        this.reviewCount++;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 복습 카드 정보를 업데이트합니다.
     *
     * @param title 제목
     * @param category 카테고리
     * @param importance 중요도
     * @param reviewCycle 반복 주기
     * @param url URL 링크
     */
    public void updateCardInfo(String title, Category category, Integer importance, Integer reviewCycle, String url) {
        if (title != null) this.title = title;
        if (category != null) this.category = category;
        if (importance != null) this.importance = importance;
        if (reviewCycle != null) this.reviewCycle = reviewCycle;
        if (url != null) this.url = url;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 정답률을 재계산하고 업데이트합니다.
     * 모든 질문의 successCount와 failCount를 기반으로 계산합니다.
     */
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