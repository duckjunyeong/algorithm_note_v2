package algorithm_note.algorithm_note_v2.chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatInitializeResponseDto {

    private String sessionId;

    private boolean success;

    private String message;

    public static ChatInitializeResponseDto success(String sessionId) {
        return new ChatInitializeResponseDto(sessionId, true, "채팅 세션이 성공적으로 생성되었습니다");
    }

    public static ChatInitializeResponseDto failure(String message) {
        return new ChatInitializeResponseDto(null, false, message);
    }
}
