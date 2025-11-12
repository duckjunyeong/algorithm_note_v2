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

    public void updateQuestionText(String questionText) {
        if (questionText != null && !questionText.trim().isEmpty()) {
            this.questionText = questionText.trim();
        }
    }

    public void updateTestResult(Integer successCount, Integer failCount) {
        if (successCount != null && successCount >= 0) {
            this.successCount = successCount;
        }
        if (failCount != null && failCount >= 0) {
            this.failCount = failCount;
        }
    }

    public void incrementCount(boolean isSuccess) {
        if (isSuccess) {
            this.successCount++;
        } else {
            this.failCount++;
        }
    }

    public static ReviewQuestion createQuestion(ReviewCard reviewCard, String questionText) {
        return ReviewQuestion.builder()
                .reviewCard(reviewCard)
                .questionText(questionText.trim())
                .build();
    }
}