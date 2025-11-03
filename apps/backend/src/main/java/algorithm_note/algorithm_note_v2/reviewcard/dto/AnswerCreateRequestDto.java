package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCreateRequestDto {

    @NotNull(message = "질문 ID는 필수입니다.")
    private Long questionId;

    @NotBlank(message = "답변 내용은 필수입니다.")
    private String content;

    @NotBlank(message = "평가 결과는 필수입니다.")
    private String evaluationResult;
}
