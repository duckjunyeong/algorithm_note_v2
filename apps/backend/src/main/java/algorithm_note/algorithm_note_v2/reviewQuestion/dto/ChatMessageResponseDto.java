package algorithm_note.algorithm_note_v2.reviewQuestion.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDto {
  private Object aiResponse;

  public static ChatMessageResponseDto of(Object aiResponse) {
    return new ChatMessageResponseDto(aiResponse);
  }
}