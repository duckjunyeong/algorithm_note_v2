package algorithm_note.algorithm_note_v2.chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequestDto {

    @NotBlank(message = "메시지 내용은 필수입니다")
    private String message;

    public static ChatMessageRequestDto of(String message) {
        return new ChatMessageRequestDto(message);
    }
}
