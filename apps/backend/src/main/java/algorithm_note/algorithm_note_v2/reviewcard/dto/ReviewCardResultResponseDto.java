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

/**
 * 복습 카드 결과 조회 응답 DTO
 *
 * 비활성화된 복습 카드의 질문과 답변 목록을 구조화하여 전달합니다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardResultResponseDto {

    /**
     * 질문과 답변 목록
     */
    private List<QuestionWithAnswersDto> questions;

    /**
     * ReviewQuestion 엔티티 리스트로부터 DTO를 생성하는 정적 팩토리 메서드
     *
     * @param reviewQuestions ReviewQuestion 엔티티 리스트
     * @param answersMap 각 질문 ID에 대한 답변 리스트 (최신순 정렬)
     * @return ReviewCardResultResponseDto
     */
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

    /**
     * 질문과 해당 질문의 답변 목록을 담는 내부 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionWithAnswersDto {

        /**
         * 복습 질문 ID
         */
        private Long reviewQuestionId;

        /**
         * 질문 텍스트
         */
        private String questionText;

        /**
         * 해당 질문에 대한 답변 목록 (최신순)
         */
        private List<AnswerResponseDto> answers;

        /**
         * ReviewQuestion과 Answer 리스트로부터 DTO를 생성하는 정적 팩토리 메서드
         *
         * @param reviewQuestion ReviewQuestion 엔티티
         * @param answers Answer 엔티티 리스트 (최신순 정렬)
         * @return QuestionWithAnswersDto
         */
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
