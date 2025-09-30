package algorithm_note.algorithm_note_v2.reviewcard.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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