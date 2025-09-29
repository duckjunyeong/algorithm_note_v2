package algorithm_note.algorithm_note_v2.problem.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing a logical unit in algorithm analysis.
 * Contains the unit name, description, specific steps, and related code.
 */
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class LogicalUnitDto {

    private String unitName;
    private String description;
    private List<String> specificSteps;
    private String code;
}