package algorithm_note.algorithm_note_v2.chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatInitializeRequestDto {

    @NotBlank(message = "태스크 유형은 필수입니다")
    @Pattern(regexp = "^(concept|memorization|approach)$", message = "태스크 유형은 concept, memorization, approach 중 하나여야 합니다")
    private String taskType;

    private String taskField;

    public static ChatInitializeRequestDto of(String taskType, String taskField) {
        return new ChatInitializeRequestDto(taskType, taskField);
    }
}
