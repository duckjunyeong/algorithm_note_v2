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

  private String response;
  private boolean success;
  private String errorMessage;

  public static GeminiResponseDto of(String response) {
    return new GeminiResponseDto(response, true, null);
  }

  public static GeminiResponseDto success(String response) {
    return new GeminiResponseDto(response,true, null);
  }

  public static GeminiResponseDto finalSuccess(String response) {
    return new GeminiResponseDto(response, true, null);
  }

  public static GeminiResponseDto failure(String errorMessage) {
    return new GeminiResponseDto(null, false, errorMessage);
  }
}