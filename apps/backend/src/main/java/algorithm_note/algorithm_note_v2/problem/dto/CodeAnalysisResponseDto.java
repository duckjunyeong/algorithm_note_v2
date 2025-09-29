package algorithm_note.algorithm_note_v2.problem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for code analysis response.
 * Contains the logical units extracted from algorithm analysis.
 */
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CodeAnalysisResponseDto {

    private List<LogicalUnitDto> logicalUnits;

    /**
     * Creates a successful response with logical units.
     */
    public static CodeAnalysisResponseDto success(List<LogicalUnitDto> logicalUnits) {
        return CodeAnalysisResponseDto.builder()
                .logicalUnits(logicalUnits)
                .build();
    }
}