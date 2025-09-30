package algorithm_note.algorithm_note_v2.problem.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Gemini API 응답 DTO
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GeminiResponseDto {

  private Object response;
  private boolean success;
  private String errorMessage;

  public static GeminiResponseDto of(Object response) {
    return new GeminiResponseDto(response, true, null);
  }

  public static GeminiResponseDto success(Object response) {
    return new GeminiResponseDto(response,true, null);
  }

  public static GeminiResponseDto finalSuccess(Object response) {
    return new GeminiResponseDto(response, true, null);
  }

  public static GeminiResponseDto failure(String errorMessage) {
    return new GeminiResponseDto(null, false, errorMessage);
  }
}