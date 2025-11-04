package algorithm_note.algorithm_note_v2.reviewcard.dto;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 복습 카드 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardResponseDto {

    private Long reviewCardId;
    private String category;
    private Long categoryId;
    private String title;
    private Integer importance;
    private Integer reviewCycle;
    private Boolean isActive;
    private Integer reviewCount;
    private Double successRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ReviewQuestionResponseDto> reviewQuestions;

    public static ReviewCardResponseDto from(ReviewCard reviewCard) {
        return ReviewCardResponseDto.builder()
                .reviewCardId(reviewCard.getReviewCardId())
                .title(reviewCard.getTitle())
                .category(reviewCard.getCategory().getName())
                .categoryId(reviewCard.getCategory().getCategoryId())
                .importance(reviewCard.getImportance())
                .reviewCycle(reviewCard.getReviewCycle())
                .isActive(reviewCard.getIsActive())
                .reviewCount(reviewCard.getReviewCount())
                .successRate(reviewCard.getSuccessRate())
                .createdAt(reviewCard.getCreatedAt())
                .updatedAt(reviewCard.getUpdatedAt())
                .reviewQuestions(
                        reviewCard.getReviewQuestions().stream()
                                .map(ReviewQuestionResponseDto::from)
                                .collect(Collectors.toList())
                )
                .build();
    }

    public static ReviewCardResponseDto fromWithoutQuestions(ReviewCard reviewCard) {
        return ReviewCardResponseDto.builder()
                .reviewCardId(reviewCard.getReviewCardId())
                .title(reviewCard.getTitle())
                .category(reviewCard.getCategory().getName())
                .categoryId(reviewCard.getCategory().getCategoryId())
                .importance(reviewCard.getImportance())
                .reviewCycle(reviewCard.getReviewCycle())
                .isActive(reviewCard.getIsActive())
                .reviewCount(reviewCard.getReviewCount())
                .successRate(reviewCard.getSuccessRate())
                .createdAt(reviewCard.getCreatedAt())
                .updatedAt(reviewCard.getUpdatedAt())
                .build();
    }
}