package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 복습 카드 생성 요청 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardCreateRequestDto {

    @NotBlank(message = "제목을 입력해주세요")
    @Size(max = 255, message = "제목은 255자 이내로 작성해주세요")
    private String title;

    @NotBlank(message = "카테고리를 입력해주세요")
    @Size(max = 100, message = "카테고리는 100자 이내로 작성해주세요")
    private String category;

    @NotNull(message = "중요도를 입력해주세요")
    @Min(value = 1, message = "중요도는 1 이상이어야 합니다")
    @Max(value = 5, message = "중요도는 5 이하여야 합니다")
    private Integer importance;

    @NotNull(message = "반복 주기를 입력해주세요")
    @Min(value = 1, message = "반복 주기는 1일 이상이어야 합니다")
    @Max(value = 365, message = "반복 주기는 365일 이하여야 합니다")
    private Integer reviewCycle;

    @NotNull(message = "질문 목록을 입력해주세요")
    @Size(min = 1, message = "최소 1개의 질문을 추가해주세요")
    @Size(max = 10, message = "질문은 최대 10개까지 추가할 수 있습니다")
    @Valid
    private List<QuestionDto> questions;

    /**
     * 질문 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {

        @NotBlank(message = "질문 내용을 입력해주세요")
        @Size(max = 1000, message = "질문은 1000자 이내로 작성해주세요")
        private String text;
    }
}