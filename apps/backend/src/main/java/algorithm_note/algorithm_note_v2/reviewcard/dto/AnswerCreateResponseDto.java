package algorithm_note.algorithm_note_v2.reviewcard.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCreateResponseDto {


    private Long answerId;


    private String message;

    public static AnswerCreateResponseDto success(Long answerId) {
        return AnswerCreateResponseDto.builder()
                .answerId(answerId)
                .message("답변이 성공적으로 저장되었습니다.")
                .build();
    }
}
