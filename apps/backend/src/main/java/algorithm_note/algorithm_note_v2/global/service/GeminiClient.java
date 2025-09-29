package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.dto.CoreLogicsResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class GeminiClient {

  private final String apiKey;
  private final String codeAnalyzePrompt;
  private final String chatbotPrompt;
  private final ObjectMapper objectMapper;
  private final RedisTemplate<String, Object> redisTemplate;

  private final Map<String, List<Content>> conversationSessions = new ConcurrentHashMap<>();

  public GeminiClient(@Value("${ai.api.key}") String apiKey,
                      @Value("${ai.prompt.code-analyzer}") String codeAnalyzePrompt,
                      @Value("${ai.prompt.interview-chatbot}") String chatbotPrompt,
                      ObjectMapper objectMapper,
                      RedisTemplate<String, Object> redisTemplate
  ) {
    this.apiKey = apiKey;
    this.codeAnalyzePrompt = codeAnalyzePrompt;
    this.chatbotPrompt = chatbotPrompt;
    this.objectMapper = objectMapper;
    this.redisTemplate = redisTemplate;
  }

  public CoreLogicsResponseDto getCoreLogics(LogicAnalyzeRequestDto analyzeRequestDto) throws JsonProcessingException {
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
    List<String> coreLogics = objectMapper.readValue(jsonResponse, new TypeReference<>() {
    });
    return CoreLogicsResponseDto.success(coreLogics);
  }
}