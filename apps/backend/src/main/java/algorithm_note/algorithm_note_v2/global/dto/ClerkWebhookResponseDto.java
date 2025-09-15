package algorithm_note.algorithm_note_v2.global.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO for webhook processing response.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClerkWebhookResponseDto {

    private String message;
    private String userId;
    private String assignedRole;
    private boolean success;

    public static ClerkWebhookResponseDto success(String message, String userId, String assignedRole) {
        return new ClerkWebhookResponseDto(message, userId, assignedRole, true);
    }

    public static ClerkWebhookResponseDto failure(String message) {
        return new ClerkWebhookResponseDto(message, null, null, false);
    }
}