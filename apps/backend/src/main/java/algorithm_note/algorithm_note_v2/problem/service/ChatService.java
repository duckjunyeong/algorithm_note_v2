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
    ProblemDto problemData = redisService.getFromHash(REDIS_KEY_PREFIX, user.getClerkId(), ProblemDto.class);
    geminiClient.startChatSession(sessionId, problemData, user.getLastName(), logicalUnit);
  }

  public String createInitialMessage(User user, LogicalUnitDto logicalUnit) {
    return String.format(
        "%s님, '%s' 문제 푸시느라 고생 많으셨어요.\n"
            + "선택하신 '%s' 로직에 대해 오답 노트를 작성해볼까요?\n"
            + "이 부분에서 어떤 점이 가장 헷갈리거나 어려웠는지 편하게 알려주세요. 제가 잘 정리할 수 있도록 도와드릴게요! 😊",
        user.getLastName(),
        logicalUnit.getUnitName(),
        logicalUnit.getDescription()
    );
  }
}
