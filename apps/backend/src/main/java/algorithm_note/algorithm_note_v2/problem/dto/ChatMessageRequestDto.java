package algorithm_note.algorithm_note_v2.problem.dto;

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

  private LogicalUnitDto logicalUnit;

  public static ChatMessageRequestDto of(String message) {
    return new ChatMessageRequestDto(message, null);
  }

  public static ChatMessageRequestDto forFirstChat(LogicalUnitDto logicalUnit) {
    return new ChatMessageRequestDto(null, logicalUnit);
  }
}