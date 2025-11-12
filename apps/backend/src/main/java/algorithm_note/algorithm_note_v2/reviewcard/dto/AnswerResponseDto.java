package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResponseDto {

    private Long answerId;

    private Long questionId;

    private String content;

    private String evaluationResult;

    private LocalDateTime createdAt;

    public static AnswerResponseDto from(Answer answer) {
        return AnswerResponseDto.builder()
                .answerId(answer.getAnswerId())
                .questionId(answer.getReviewQuestion().getReviewQuestionId())
                .content(answer.getContent())
                .evaluationResult(answer.getEvaluationResult().name())
                .createdAt(answer.getCreatedAt())
                .build();
    }
}
