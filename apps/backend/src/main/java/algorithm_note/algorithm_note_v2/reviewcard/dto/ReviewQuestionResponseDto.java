package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewQuestionResponseDto {

    private Long reviewQuestionId;
    private String questionText;
    private LocalDateTime createdAt;

    public static ReviewQuestionResponseDto from(ReviewQuestion reviewQuestion) {
        return ReviewQuestionResponseDto.builder()
                .reviewQuestionId(reviewQuestion.getReviewQuestionId())
                .questionText(reviewQuestion.getQuestionText())
                .createdAt(reviewQuestion.getCreatedAt())
                .build();
    }
}