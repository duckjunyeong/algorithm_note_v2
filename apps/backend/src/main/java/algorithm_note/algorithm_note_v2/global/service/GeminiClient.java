package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.dto.CoreLogicsResponseDto;
import algorithm_note.algorithm_note_v2.problem.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
@Slf4j
public class GeminiClient {

  private final String apiKey;
  private final String codeAnalyzePrompt;
  private final String chatbotPrompt;
  private final ObjectMapper objectMapper;
  private final RedisService redisService;
  private static final String REDIS_KEY_PREFIX = "problem:temp:";

  private final Map<String, List<Content>> conversationSessions = new ConcurrentHashMap<>();


  public CodeAnalysisResponseDto getCoreLogics(LogicAnalyzeRequestDto analyzeRequestDto) throws JsonProcessingException {
    Client client = Client.builder().apiKey(apiKey).build();

    String prompt = String.format(
        codeAnalyzePrompt,
        analyzeRequestDto.getDescription(),
        analyzeRequestDto.getInput(),
        analyzeRequestDto.getOutput(),
        analyzeRequestDto.getCode()
    );

    GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", prompt, null);
    String jsonResponse = response.text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

    log.info("AI로부터 핵심로직 추출결과 (JSON): {}", jsonResponse);

    return objectMapper.readValue(jsonResponse, new TypeReference<>() {
    });

  }

  public GeminiResponseDto sendMessage(String sessionId, String userMessage) {
    if (!conversationSessions.containsKey(sessionId)) {
      throw new IllegalStateException("세션이 초기화되지 않았습니다. 먼저 채팅을 시작해주세요.");
    }

    List<Content> history = conversationSessions.get(sessionId);
    Client client = Client.builder().apiKey(apiKey).build();

    try {
      Content userContent = Content.builder()
          .role("user")
          .parts(List.of(Part.builder().text(userMessage).build()))
          .build();
      history.add(userContent);

      GenerateContentResponse response = client.models.generateContent(
          "gemini-2.5-flash",
          history,
          null
      );

      String aiResponse = response.text();

      Content aiContent = Content.builder()
          .role("model")
          .parts(List.of(Part.builder().text(aiResponse).build()))
          .build();
      history.add(aiContent);

      boolean isFinalResponse = isFinalizationResponse(aiResponse);

      if (isFinalResponse) {
        // redis
        redisService.saveToHash(REDIS_KEY_PREFIX, sessionId, aiResponse);
        log.info("세션 {}: 최종 응답 감지 및 Redis 저장 완료", sessionId);
      }

      log.info("세션 {}: 사용자 메시지 - {}", sessionId, userMessage);
      log.info("세션 {}: AI 응답 - {} (최종응답: {})", sessionId, aiResponse, isFinalResponse);

      return GeminiResponseDto.of(aiResponse, isFinalResponse);

    } catch (Exception e) {
      log.error("세션 {}에서 메시지 처리 중 오류 발생: {}", sessionId, e.getMessage(), e);
      return GeminiResponseDto.of("죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.", false);
    }
  }

  public void startChatSession(String sessionId, ProblemDto problem, String username, CodeAnalysisResponseDto.LogicalBlock selectedBlock) {
    List<Content> history = new ArrayList<>();

    if (chatbotPrompt != null && !chatbotPrompt.trim().isEmpty()) {
      // 선택된 블록 정보를 포함한 시스템 프롬프트 생성
      String enhancedPrompt = String.format(chatbotPrompt,
          username,
          problem.getTitle(),
          selectedBlock.getDescription(),
          selectedBlock.getCode(),
          problem.getInputCondition() + problem.getOutputCondition(),
          problem.getConstraints());

      Content systemContent = Content.builder()
          .role("user")
          .parts(List.of(Part.builder().text(enhancedPrompt).build()))
          .build();
      history.add(systemContent);

      Content aiAck = Content.builder()
          .role("model")
          .parts(List.of(Part.builder().text("네, 이해했습니다. 선택하신 로직 블록에 대해 자세히 알아보고 오답노트를 함께 작성해보겠습니다!").build()))
          .build();
      history.add(aiAck);
    }

    conversationSessions.put(sessionId, history);
    log.info("블록 정보 포함 챗봇 세션이 시작되었습니다. 세션 ID: {}, 문제: {}, 블록: {}", sessionId, problem.getTitle(), selectedBlock.getTitle());
  }

  private boolean isFinalizationResponse(String response) {
    return response.contains("최종 오답노트를 만들었어요! 📝") &&
        response.contains("문제 제목:") &&
        response.contains("알게 된 핵심 내용:");
  }
}