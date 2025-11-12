package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardResultResponseDto {

    private List<QuestionWithAnswersDto> questions;

    public static ReviewCardResultResponseDto from(
            List<ReviewQuestion> reviewQuestions,
            Map<Long, List<Answer>> answersMap) {

        List<QuestionWithAnswersDto> questions = reviewQuestions.stream()
                .map(question -> QuestionWithAnswersDto.from(
                        question,
                        answersMap.getOrDefault(question.getReviewQuestionId(), List.of())
                ))
                .collect(Collectors.toList());

        return ReviewCardResultResponseDto.builder()
                .questions(questions)
                .build();
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionWithAnswersDto {


        private Long reviewQuestionId;

        private String questionText;

        private List<AnswerResponseDto> answers;

        public static QuestionWithAnswersDto from(ReviewQuestion reviewQuestion, List<Answer> answers) {
            return QuestionWithAnswersDto.builder()
                    .reviewQuestionId(reviewQuestion.getReviewQuestionId())
                    .questionText(reviewQuestion.getQuestionText())
                    .answers(answers.stream()
                            .map(AnswerResponseDto::from)
                            .collect(Collectors.toList()))
                    .build();
        }
    }
}
