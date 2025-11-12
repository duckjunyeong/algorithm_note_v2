package algorithm_note.algorithm_note_v2.reviewcard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardCreateResponseDto {

    private Long reviewCardId;
    private String message;

    public static ReviewCardCreateResponseDto success(Long reviewCardId) {
        return ReviewCardCreateResponseDto.builder()
                .reviewCardId(reviewCardId)
                .message("복습 카드가 성공적으로 생성되었습니다.")
                .build();
    }
}