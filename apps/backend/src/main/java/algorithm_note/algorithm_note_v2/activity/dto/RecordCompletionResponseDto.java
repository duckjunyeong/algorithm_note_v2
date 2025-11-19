package algorithm_note.algorithm_note_v2.activity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RecordCompletionResponseDto {
    private boolean success;
    private String message;
    private ActivityResponseDto activityRecord;

    public static RecordCompletionResponseDto success(ActivityResponseDto activityRecord, String message) {
        return new RecordCompletionResponseDto(true, message, activityRecord);
    }

    public static RecordCompletionResponseDto failure(String message) {
        return new RecordCompletionResponseDto(false, message, null);
    }
}
