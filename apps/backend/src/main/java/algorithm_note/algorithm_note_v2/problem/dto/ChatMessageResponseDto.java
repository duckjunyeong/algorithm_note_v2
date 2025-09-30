package algorithm_note.algorithm_note_v2.problem.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDto {
  private String aiResponse;

  public static ChatMessageResponseDto of(String aiResponse) {
    return new ChatMessageResponseDto(aiResponse);
  }
}