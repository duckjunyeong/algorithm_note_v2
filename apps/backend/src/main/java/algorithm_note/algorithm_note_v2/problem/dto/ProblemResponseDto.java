package algorithm_note.algorithm_note_v2.problem.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Response DTO for problem registration operations.
 */
@Getter
@Builder
public class ProblemResponseDto {

    private String message;
    private String status;

    /**
     * Creates a success response.
     */
    public static ProblemResponseDto success(String message) {
        return ProblemResponseDto.builder()
                .message(message)
                .status("success")
                .build();
    }

    /**
     * Creates a failure response.
     */
    public static ProblemResponseDto failure(String message) {
        return ProblemResponseDto.builder()
                .message(message)
                .status("error")
                .build();
    }
}