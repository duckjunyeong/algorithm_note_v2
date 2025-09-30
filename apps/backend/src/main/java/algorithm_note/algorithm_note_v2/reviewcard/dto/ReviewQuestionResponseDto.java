package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 복습 질문 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewQuestionResponseDto {

    private Long reviewQuestionId;
    private String questionText;
    private LocalDateTime createdAt;

    /**
     * ReviewQuestion 엔티티로부터 DTO를 생성하는 정적 팩토리 메서드
     *
     * @param reviewQuestion ReviewQuestion 엔티티
     * @return ReviewQuestionResponseDto
     */
    public static ReviewQuestionResponseDto from(ReviewQuestion reviewQuestion) {
        return ReviewQuestionResponseDto.builder()
                .reviewQuestionId(reviewQuestion.getReviewQuestionId())
                .questionText(reviewQuestion.getQuestionText())
                .createdAt(reviewQuestion.getCreatedAt())
                .build();
    }
}