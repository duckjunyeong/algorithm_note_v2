package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PdfGenerationRequestDto {

    @NotEmpty(message = "ReviewCard ID 목록은 필수입니다.")
    private List<Long> reviewCardIds;

    private String examTitle = "시험지";

    private String instruction = "각 질문에 대한 답변을 작성하시오.";
}
