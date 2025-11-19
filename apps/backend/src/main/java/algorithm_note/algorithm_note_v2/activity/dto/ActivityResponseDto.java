package algorithm_note.algorithm_note_v2.activity.dto;

import algorithm_note.algorithm_note_v2.activity.domain.Activity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDto {
    private Long activityId;
    private LocalDate activityDate;
    private Integer reviewCardsCompleted;
    private Integer questionsAnswered;
    private Integer studyTimeMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ActivityResponseDto from(Activity activity) {
        return ActivityResponseDto.builder()
                .activityId(activity.getActivityId())
                .activityDate(activity.getActivityDate())
                .reviewCardsCompleted(activity.getReviewCardsCompleted())
                .questionsAnswered(activity.getQuestionsAnswered())
                .studyTimeMinutes(activity.getStudyTimeMinutes())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }
}
