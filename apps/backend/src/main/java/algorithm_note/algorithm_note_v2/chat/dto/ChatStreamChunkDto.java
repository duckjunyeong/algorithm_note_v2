package algorithm_note.algorithm_note_v2.chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatStreamChunkDto {
    private String content;

    private boolean done;

    public static ChatStreamChunkDto of(String content) {
        return new ChatStreamChunkDto(content, false);
    }

    public static ChatStreamChunkDto done() {
        return new ChatStreamChunkDto(null, true);
    }
}
