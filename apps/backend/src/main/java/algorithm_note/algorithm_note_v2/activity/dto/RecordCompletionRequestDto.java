package algorithm_note.algorithm_note_v2.activity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecordCompletionRequestDto {
    @NotNull(message = "활동 날짜는 필수입니다")
    private LocalDate activityDate;

    private Integer reviewCardsCompleted;

    private Integer questionsAnswered;

    private Integer studyTimeMinutes;
}
