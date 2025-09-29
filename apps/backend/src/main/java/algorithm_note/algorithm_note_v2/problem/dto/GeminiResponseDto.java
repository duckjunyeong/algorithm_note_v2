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
  private boolean isFinalResponse;
  private boolean success;
  private String errorMessage;

  /**
   * 범용 Gemini 응답 DTO 생성
   * @param response 응답 내용
   * @param isFinalResponse 최종 응답 여부
   * @return Gemini 응답 DTO
   */
  public static GeminiResponseDto of(String response, boolean isFinalResponse) {
    return new GeminiResponseDto(response, isFinalResponse, true, null);
  }

  /**
   * 성공 응답 DTO 생성
   * @param response 응답 내용
   * @return 성공 상태의 DTO
   */
  public static GeminiResponseDto success(String response) {
    return new GeminiResponseDto(response, false, true, null);
  }

  /**
   * 최종 성공 응답 DTO 생성
   * @param response 응답 내용
   * @return 최종 성공 상태의 DTO
   */
  public static GeminiResponseDto finalSuccess(String response) {
    return new GeminiResponseDto(response, true, true, null);
  }

  /**
   * 실패 응답 DTO 생성
   * @param errorMessage 에러 메시지
   * @return 실패 상태의 DTO
   */
  public static GeminiResponseDto failure(String errorMessage) {
    return new GeminiResponseDto(null, false, false, errorMessage);
  }
}