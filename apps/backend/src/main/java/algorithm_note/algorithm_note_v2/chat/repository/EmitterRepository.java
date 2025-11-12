package algorithm_note.algorithm_note_v2.chat.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@RequiredArgsConstructor
public class EmitterRepository {

  private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

  public void save(Long id, SseEmitter emitter) {
    emitters.put(id, emitter);
  }

  public void deleteById(Long userId) {
    emitters.remove(userId);
  }

  public Optional<SseEmitter> get(Long userId) {
    return Optional.ofNullable(emitters.get(userId));
  }

  public Map<Long, SseEmitter> getAllEmitters() {
    return emitters;
  }

  public void configureCallbacks(Long userId, SseEmitter emitter) {
    emitter.onTimeout(() -> {
      deleteById(userId);
    });
    emitter.onError(e -> {
      deleteById(userId);
    });
    emitter.onCompletion(() -> {
      deleteById(userId);
    });
  }
}