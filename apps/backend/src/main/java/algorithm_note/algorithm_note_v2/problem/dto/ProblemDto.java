package algorithm_note.algorithm_note_v2.problem.dto;

import algorithm_note.algorithm_note_v2.problem.domain.Problem;
import lombok.Builder;
import lombok.Getter;

/**
 * DTO for problem data transfer and temporary storage.
 * Used for Redis caching before permanent storage.
 */
@Getter
@Builder
public class ProblemDto {

    private String title;
    private String description;
    private String inputCondition;
    private String outputCondition;
    private String constraints;
    private String url;

    /**
     * Creates ProblemDto from manual request data.
     */
    public static ProblemDto fromManualRequest(ProblemManualRequestDto request) {
        return ProblemDto.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .inputCondition(request.getInputCondition())
                .outputCondition(request.getOutputCondition())
                .constraints(request.getConstraints())
                .build();
    }

    /**
     * Creates ProblemDto from scraped data.
     */
    public static ProblemDto fromScrapedData(String title, String description,
                                           String inputCondition, String outputCondition,
                                           String constraints, String url) {
        return ProblemDto.builder()
                .title(title)
                .description(description)
                .inputCondition(inputCondition)
                .outputCondition(outputCondition)
                .constraints(constraints)
                .url(url)
                .build();
    }
}