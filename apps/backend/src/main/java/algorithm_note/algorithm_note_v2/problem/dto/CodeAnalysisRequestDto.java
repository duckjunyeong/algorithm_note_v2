package algorithm_note.algorithm_note_v2.problem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO for code analysis request from frontend.
 * Contains the programming language and user's algorithm code.
 */
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CodeAnalysisRequestDto {

    @NotBlank(message = "Programming language is required")
    private String language;

    @NotBlank(message = "Code is required")
    private String code;
}