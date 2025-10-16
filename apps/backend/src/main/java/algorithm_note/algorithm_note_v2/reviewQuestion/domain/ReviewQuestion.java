package algorithm_note.algorithm_note_v2.reviewQuestion.domain;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ReviewQuestion entity representing individual questions within a review card.
 *
 * 복습 질문 엔티티 - 복습 카드 내의 개별 질문을 나타냅니다.
 */
@Entity
@Table(name = "review_question")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_question_id")
    private Long reviewQuestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_card_id", nullable = false)
    @JsonBackReference
    private ReviewCard reviewCard;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "success_count", nullable = false)
    @Builder.Default
    private Integer successCount = 0;

    @Column(name = "fail_count", nullable = false)
    @Builder.Default
    private Integer failCount = 0;

    @OneToMany(mappedBy = "reviewQuestion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<Answer> answers = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 질문 텍스트를 업데이트합니다.
     *
     * @param questionText 새로운 질문 텍스트
     */
    public void updateQuestionText(String questionText) {
        if (questionText != null && !questionText.trim().isEmpty()) {
            this.questionText = questionText.trim();
        }
    }

    /**
     * 테스트 결과를 업데이트합니다.
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
    }

    /**
     * 답변 결과에 따라 성공/실패 카운트를 증가시킵니다.
     *
     * @param isSuccess 성공 여부 (true: 성공, false: 실패)
     */
    public void incrementCount(boolean isSuccess) {
        if (isSuccess) {
            this.successCount++;
        } else {
            this.failCount++;
        }
    }

    /**
     * ReviewQuestion을 생성하는 정적 팩토리 메서드
     *
     * @param reviewCard 소속된 복습 카드
     * @param questionText 질문 텍스트
     * @return 생성된 ReviewQuestion 인스턴스
     */
    public static ReviewQuestion createQuestion(ReviewCard reviewCard, String questionText) {
        return ReviewQuestion.builder()
                .reviewCard(reviewCard)
                .questionText(questionText.trim())
                .build();
    }
}