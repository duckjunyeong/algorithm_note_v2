package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 복습 카드 결과 업데이트 요청 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardUpdateRequestDto {

    private String title;

    private String category;

    @Min(value = 1, message = "중요도는 1 이상이어야 합니다")
    @Max(value = 5, message = "중요도는 5 이하여야 합니다")
    private Integer importance;

    @Min(value = 1, message = "복습 주기는 1일 이상이어야 합니다")
    @Max(value = 15, message = "복습 주기는 15일 이하여야 합니다")
    private Integer reviewCycle;

    @NotNull(message = "isActive는 필수입니다")
    private Boolean isActive;

    @Builder.Default
    private List<Long> deletedQuestionIds = List.of();

    @Builder.Default
    private List<QuestionUpdateDto> questionUpdates = List.of();

    /**
     * 질문별 업데이트 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionUpdateDto {
        @NotNull(message = "reviewQuestionId는 필수입니다")
        private Long reviewQuestionId;

        @Min(value = 0, message = "successCount는 0 이상이어야 합니다")
        private Integer successCount;

        @Min(value = 0, message = "failCount는 0 이상이어야 합니다")
        private Integer failCount;
    }
}
