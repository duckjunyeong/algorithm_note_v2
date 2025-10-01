package algorithm_note.algorithm_note_v2.reviewcard.domain;

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

    @Column(length = 100)
    private String category;

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

    @Column(name = "success_count", nullable = false)
    @Builder.Default
    private Integer successCount = 0;

    @Column(name = "fail_count", nullable = false)
    @Builder.Default
    private Integer failCount = 0;

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
     */
    public void updateCardInfo(String title, String category, Integer importance, Integer reviewCycle) {
        if (title != null) this.title = title;
        if (category != null) this.category = category;
        if (importance != null) this.importance = importance;
        if (reviewCycle != null) this.reviewCycle = reviewCycle;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 복습 테스트 결과를 반영합니다.
     * 로컬에서 계산된 성공/실패 횟수를 설정합니다.
     *
     * @param successCount 성공 횟수
     * @param failCount 실패 횟수
     */
    public void updateTestResult(Integer successCount, Integer failCount) {
        if (successCount != null && successCount >= 0) {
            this.successCount = successCount;
        }
        if (failCount != null && failCount >= 0) {
            this.failCount = failCount;
        }
        this.updatedAt = LocalDateTime.now();
    }
}