package algorithm_note.algorithm_note_v2.reviewcard.domain;

import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "answer")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_question_id", nullable = false)
    @JsonBackReference
    private ReviewQuestion reviewQuestion;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluation_result", nullable = false, length = 10)
    private EvaluationResult evaluationResult;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum EvaluationResult {
        SUCCESS,  // 성공
        FAILURE   // 실패
    }

    public static Answer createAnswer(ReviewQuestion reviewQuestion, String content, EvaluationResult evaluationResult) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("답변 내용은 필수입니다.");
        }
        if (reviewQuestion == null) {
            throw new IllegalArgumentException("복습 질문은 필수입니다.");
        }
        if (evaluationResult == null) {
            throw new IllegalArgumentException("평가 결과는 필수입니다.");
        }

        return Answer.builder()
                .reviewQuestion(reviewQuestion)
                .content(content.trim())
                .evaluationResult(evaluationResult)
                .build();
    }
}
