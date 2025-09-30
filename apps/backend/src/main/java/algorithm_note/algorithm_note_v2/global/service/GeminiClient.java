package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.problem.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class GeminiClient {

  private final String apiKey;
  private final String answerGenerPrompt;
  private final ObjectMapper objectMapper;
  private final Client client;

  public GeminiClient(ObjectMapper objectMapper, RedisService redisService,
                      @Value("${ai.api.key}") String apiKey,
                      @Value("${ai.prompt.answer-generator}") String answerGenerPrompt) {
    this.objectMapper = objectMapper;
    this.apiKey = apiKey;
    this.answerGenerPrompt = answerGenerPrompt;
    client = Client.builder().apiKey(apiKey).build();
  }



  public GeminiResponseDto sendMessage(String userMessage) {
    String finalMessage =  String.format(answerGenerPrompt, userMessage);

    try {
      Content userContent = Content.builder()
          .role("user")
          .parts(List.of(Part.builder().text(finalMessage).build()))
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-2.5-flash",
          userContent,
          null
      );

      String aiResponse = response.text();

      log.info("질문지 생성 결과: {}", aiResponse);

      return GeminiResponseDto.of(aiResponse);

    } catch (Exception e) {
      log.error("메시지 처리 중 오류 발생: {}" , e.getMessage(), e);
      return GeminiResponseDto.of("죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.");
    }
  }
}