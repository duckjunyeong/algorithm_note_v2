package algorithm_note.algorithm_note_v2.reviewcard.dto;

import lombok.*;

/**
 * 답변 생성 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCreateResponseDto {

    /**
     * 생성된 답변 ID
     */
    private Long answerId;

    /**
     * 응답 메시지
     */
    private String message;

    /**
     * 성공 응답을 생성하는 정적 팩토리 메서드
     *
     * @param answerId 생성된 답변 ID
     * @return AnswerCreateResponseDto
     */
    public static AnswerCreateResponseDto success(Long answerId) {
        return AnswerCreateResponseDto.builder()
                .answerId(answerId)
                .message("답변이 성공적으로 저장되었습니다.")
                .build();
    }
}
