package algorithm_note.algorithm_note_v2.problem.service;

import algorithm_note.algorithm_note_v2.global.service.GeminiClient;
import algorithm_note.algorithm_note_v2.global.service.RedisService;
import algorithm_note.algorithm_note_v2.problem.dto.LogicalUnitDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemDto;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ChatService {

  private final RedisService redisService;
  private final GeminiClient geminiClient;

  private static final String REDIS_KEY_PREFIX = "problem:temp:";

  public void connectChatSession(String sessionId, User user, LogicalUnitDto logicalUnit) throws JsonProcessingException {
    geminiClient.startChatSession(sessionId, user.getLastName());
  }
}
