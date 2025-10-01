package algorithm_note.algorithm_note_v2.reviewQuestion.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequestDto {

  private String message;

  public static ChatMessageRequestDto of(String message) {
    return new ChatMessageRequestDto(message);
  }
}
