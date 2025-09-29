package algorithm_note.algorithm_note_v2.problem.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅 메시지 응답 DTO
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDto {

  private String sessionId;
  private String userMessage;
  private String aiResponse;
  private boolean isFinalResponse;
  private long timestamp;

  /**
   * 일반 채팅 응답 DTO 생성
   * @param sessionId 세션 ID
   * @param userMessage 사용자 메시지
   * @param aiResponse AI 응답
   * @return 채팅 응답 DTO
   */
  public static ChatMessageResponseDto of(String sessionId, String userMessage, String aiResponse) {
    return new ChatMessageResponseDto(sessionId, userMessage, aiResponse, false, System.currentTimeMillis());
  }

  /**
   * 최종 응답 여부를 지정한 채팅 응답 DTO 생성
   * @param sessionId 세션 ID
   * @param userMessage 사용자 메시지
   * @param aiResponse AI 응답
   * @param isFinalResponse 최종 응답 여부
   * @return 채팅 응답 DTO
   */
  public static ChatMessageResponseDto of(String sessionId, String userMessage, String aiResponse, boolean isFinalResponse) {
    return new ChatMessageResponseDto(sessionId, userMessage, aiResponse, isFinalResponse, System.currentTimeMillis());
  }
}