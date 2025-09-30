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
    private String title;
    private String category;
    private Integer importance;
    private Integer reviewCycle;
    private Boolean isActive;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ReviewQuestionResponseDto> reviewQuestions;

    /**
     * ReviewCard 엔티티로부터 DTO를 생성하는 정적 팩토리 메서드
     *
     * @param reviewCard ReviewCard 엔티티
     * @return ReviewCardResponseDto
     */
    public static ReviewCardResponseDto from(ReviewCard reviewCard) {
        return ReviewCardResponseDto.builder()
                .reviewCardId(reviewCard.getReviewCardId())
                .title(reviewCard.getTitle())
                .category(reviewCard.getCategory())
                .importance(reviewCard.getImportance())
                .reviewCycle(reviewCard.getReviewCycle())
                .isActive(reviewCard.getIsActive())
                .reviewCount(reviewCard.getReviewCount())
                .createdAt(reviewCard.getCreatedAt())
                .updatedAt(reviewCard.getUpdatedAt())
                .reviewQuestions(
                        reviewCard.getReviewQuestions().stream()
                                .map(ReviewQuestionResponseDto::from)
                                .collect(Collectors.toList())
                )
                .build();
    }

    /**
     * 질문 정보 없이 기본 정보만 포함하는 DTO 생성
     *
     * @param reviewCard ReviewCard 엔티티
     * @return ReviewCardResponseDto (질문 정보 제외)
     */
    public static ReviewCardResponseDto fromWithoutQuestions(ReviewCard reviewCard) {
        return ReviewCardResponseDto.builder()
                .reviewCardId(reviewCard.getReviewCardId())
                .title(reviewCard.getTitle())
                .category(reviewCard.getCategory())
                .importance(reviewCard.getImportance())
                .reviewCycle(reviewCard.getReviewCycle())
                .isActive(reviewCard.getIsActive())
                .reviewCount(reviewCard.getReviewCount())
                .createdAt(reviewCard.getCreatedAt())
                .updatedAt(reviewCard.getUpdatedAt())
                .build();
    }
}