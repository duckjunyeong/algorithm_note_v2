package algorithm_note.algorithm_note_v2.problem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request DTO for manual problem registration.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemManualRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Input condition is required")
    private String inputCondition;

    @NotBlank(message = "Output condition is required")
    private String outputCondition;

    private String constraints; // Optional field
}