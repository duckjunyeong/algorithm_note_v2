package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * 답변 생성 요청 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCreateRequestDto {

    /**
     * 복습 질문 ID
     */
    @NotNull(message = "질문 ID는 필수입니다.")
    private Long questionId;

    /**
     * 답변 내용
     */
    @NotBlank(message = "답변 내용은 필수입니다.")
    private String content;

    /**
     * 평가 결과 (SUCCESS 또는 FAILURE)
     */
    @NotBlank(message = "평가 결과는 필수입니다.")
    private String evaluationResult;
}
