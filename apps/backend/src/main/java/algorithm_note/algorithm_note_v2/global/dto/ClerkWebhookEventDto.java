package algorithm_note.algorithm_note_v2.global.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO representing incoming Clerk webhook events.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClerkWebhookEventDto {

    @JsonProperty("type")
    private String type;

    @JsonProperty("data")
    private ClerkUserDto data;

    @JsonProperty("object")
    private String object;

    public static ClerkWebhookEventDto of(String type, ClerkUserDto data, String object) {
        return new ClerkWebhookEventDto(type, data, object);
    }

    public boolean isUserCreatedEvent() {
        return "user.created".equals(type);
    }
}