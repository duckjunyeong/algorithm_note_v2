package algorithm_note.algorithm_note_v2.global.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 핵심 로직 응답 DTO
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CoreLogicsResponseDto {

  private List<String> coreLogics;
  private boolean success;
  private String errorMessage;

  /**
   * 성공 응답 DTO 생성
   * @param coreLogics 핵심 로직 목록
   * @return 성공 상태의 DTO
   */
  public static CoreLogicsResponseDto success(List<String> coreLogics) {
    return new CoreLogicsResponseDto(coreLogics, true, null);
  }

  /**
   * 실패 응답 DTO 생성
   * @param errorMessage 에러 메시지
   * @return 실패 상태의 DTO
   */
  public static CoreLogicsResponseDto failure(String errorMessage) {
    return new CoreLogicsResponseDto(null, false, errorMessage);
  }
}