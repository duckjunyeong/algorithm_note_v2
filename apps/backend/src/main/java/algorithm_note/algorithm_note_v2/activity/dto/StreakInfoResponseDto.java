package algorithm_note.algorithm_note_v2.activity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreakInfoResponseDto {
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastCompletedDate;
    private Boolean todayCompleted;
}
