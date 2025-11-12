package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThymeleafTemplateDto {

    private String courseTitle;
    private String examTitle;
    private String instruction;
    private List<ProblemDto> problems;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProblemDto {
        private String question;
    }

    public static ThymeleafTemplateDto from(
            List<ReviewCard> cards,
            String examTitle,
            String instruction) {

        List<ProblemDto> problems = cards.stream()
                .flatMap(card -> card.getReviewQuestions().stream())
                .map(q -> ProblemDto.builder()
                        .question(q.getQuestionText())
                        .build())
                .collect(Collectors.toList());

        return ThymeleafTemplateDto.builder()
                .courseTitle("Synapse AI")
                .examTitle(examTitle)
                .instruction(instruction)
                .problems(problems)
                .build();
    }
}
