package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 답변 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResponseDto {

    /**
     * 답변 ID
     */
    private Long answerId;

    /**
     * 복습 질문 ID
     */
    private Long questionId;

    /**
     * 답변 내용
     */
    private String content;

    /**
     * 평가 결과 (SUCCESS 또는 FAILURE)
     */
    private String evaluationResult;

    /**
     * 생성 일시
     */
    private LocalDateTime createdAt;

    /**
     * Answer 엔티티를 AnswerResponseDto로 변환하는 정적 팩토리 메서드
     *
     * @param answer Answer 엔티티
     * @return AnswerResponseDto
     */
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
