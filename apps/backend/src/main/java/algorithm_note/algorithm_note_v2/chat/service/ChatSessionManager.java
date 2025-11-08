package algorithm_note.algorithm_note_v2.chat.service;

import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import algorithm_note.algorithm_note_v2.chat.exception.SessionNotFoundException;
import algorithm_note.algorithm_note_v2.chat.repository.ChatSessionRepository;
import com.google.genai.Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSessionManager {

    private final ChatSessionRepository chatSessionRepository;

    @Value("${ai.api.key}")
    private String apiKey;

    private final ConcurrentHashMap<String, Client> clientCache = new ConcurrentHashMap<>();

    private static final long SESSION_TTL = 3600L;

    public ChatSession createSession(String taskType, String taskField, String userName) {
        String sessionId = UUID.randomUUID().toString();

        Client client = Client.builder().apiKey(apiKey).build();
        clientCache.put(sessionId, client);
        log.info("Created Gemini Client for session: {}", sessionId);

        ChatSession session = ChatSession.builder()
                .sessionId(sessionId)
                .taskType(taskType)
                .taskField(taskField)
                .userName(userName)
                .createdAt(LocalDateTime.now())
                .ttl(SESSION_TTL)
                .build();

        chatSessionRepository.save(session);
        log.info("Created chat session: {} for user: {}", sessionId, userName);

        return session;
    }

    public ChatSession getSession(String sessionId) {
        return chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    log.warn("Session not found: {}", sessionId);
                    return new SessionNotFoundException("세션을 찾을 수 없습니다: " + sessionId);
                });
    }

    public Client getClient(String sessionId) {
        Client client = clientCache.get(sessionId);

        if (client == null) {
            log.warn("Client not found for session: {}", sessionId);
            throw new SessionNotFoundException("세션 클라이언트를 찾을 수 없습니다: " + sessionId);
        }

        return client;
    }

    public void updateSession(ChatSession session) {
        chatSessionRepository.save(session);
        log.debug("Updated session: {}", session.getSessionId());
    }

    public void deleteSession(String sessionId) {
        chatSessionRepository.deleteById(sessionId);
        clientCache.remove(sessionId);
        log.info("Deleted session: {}", sessionId);
    }

    public void addUserMessage(String sessionId, String message) {
        ChatSession session = getSession(sessionId);
        session.addUserMessage(message);
        updateSession(session);
        log.debug("Added user message to session: {}", sessionId);
    }

    public void addAssistantMessage(String sessionId, String message) {
        ChatSession session = getSession(sessionId);
        session.addAssistantMessage(message);
        updateSession(session);
        log.debug("Added assistant message to session: {}", sessionId);
    }
}
