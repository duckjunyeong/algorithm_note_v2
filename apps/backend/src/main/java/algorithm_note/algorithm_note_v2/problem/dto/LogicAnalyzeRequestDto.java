package algorithm_note.algorithm_note_v2.problem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO for requesting logic analysis from Gemini API.
 * Contains problem information and user code for AI analysis.
 */
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class LogicAnalyzeRequestDto {

    @NotBlank(message = "Problem description is required")
    private String description;

    @NotBlank(message = "Input condition is required")
    private String input;

    @NotBlank(message = "Output condition is required")
    private String output;

    @NotBlank(message = "Code is required")
    private String code;
}