package algorithm_note.algorithm_note_v2.reviewcard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 복습 카드 생성 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardCreateResponseDto {

    private Long reviewCardId;
    private String message;

    /**
     * 생성 성공 응답을 위한 정적 팩토리 메서드
     *
     * @param reviewCardId 생성된 복습 카드 ID
     * @return ReviewCardCreateResponseDto
     */
    public static ReviewCardCreateResponseDto success(Long reviewCardId) {
        return ReviewCardCreateResponseDto.builder()
                .reviewCardId(reviewCardId)
                .message("복습 카드가 성공적으로 생성되었습니다.")
                .build();
    }
}