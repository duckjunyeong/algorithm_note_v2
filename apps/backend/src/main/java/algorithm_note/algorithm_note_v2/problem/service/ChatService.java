package algorithm_note.algorithm_note_v2.problem.service;

import algorithm_note.algorithm_note_v2.global.service.RedisService;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemDto;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ChatService {

  private final RedisService redisService;

  private static final String REDIS_KEY_PREFIX = "problem:temp:";

  public String createInitialChatMessage(String logicId, String sessionId, User user) throws JsonProcessingException {
    ProblemDto problemData = redisService.getFromHash(REDIS_KEY_PREFIX, user.getClerkId(), ProblemDto.class);

}
