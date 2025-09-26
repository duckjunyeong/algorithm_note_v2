package algorithm_note.algorithm_note_v2.problem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request DTO for URL-based problem registration.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemUrlRequestDto {

    @NotBlank(message = "URL is required")
    @Pattern(
        regexp = "https://www\\.acmicpc\\.net/problem/\\d+",
        message = "URL must be in the format: https://www.acmicpc.net/problem/{problemNumber}"
    )
    private String url;
}