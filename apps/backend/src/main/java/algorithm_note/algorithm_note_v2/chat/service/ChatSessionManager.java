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
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSessionManager {

    private final ChatSessionRepository chatSessionRepository;

    // Google Gemini SDK는 GOOGLE_API_KEY 환경변수를 자동으로 읽습니다.
    // @Value 어노테이션으로 주입하는 대신 SDK의 기본 동작을 사용합니다.

    private final ConcurrentHashMap<String, Client> clientCache = new ConcurrentHashMap<>();

    private static final long SESSION_TTL = 3600L;

    public ChatSession createSession(Long userId, String taskType, String taskField, String userName) {
        String sessionId = "user-" + userId;

        if (chatSessionRepository.existsById(sessionId)) {
            deleteSession(sessionId);
        }

        // API Key 진단 로깅
        logApiKeyDiagnostics("createSession");

        log.info("Building Gemini Client using GOOGLE_API_KEY environment variable");
        Client client;
        try {
            // API 키를 환경변수에서 읽어서 명시적으로 전달
            String apiKey = System.getenv("GOOGLE_API_KEY");
            if (apiKey == null || apiKey.isEmpty()) {
                throw new IllegalStateException("GOOGLE_API_KEY environment variable is not set");
            }
            log.info("GOOGLE_API_KEY found: {}****", apiKey.substring(0, 4));

            // SDK에 API 키를 명시적으로 전달
            client = Client.builder().apiKey(apiKey).build();
            log.info("✅ Client created with API key");
            log.info("Client object created: {}", client != null ? "NOT NULL" : "NULL");

            clientCache.put(sessionId, client);
            log.info("Created Gemini Client for session: {}", sessionId);
        } catch (Exception e) {
            log.error("❌ Failed to create Gemini Client: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Hint: Make sure GOOGLE_API_KEY environment variable is set");
            throw e;
        }

        ChatSession session = ChatSession.builder()
                .sessionId(sessionId)
                .sessionMode("generation")
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

    public ChatSession createTestSession(Long userId, String tutorLevel, String userName, Long reviewCardId, List<ChatSession.ReviewQuestionInfo> reviewQuestions) {
        String sessionId = "user-" + userId;

        if (chatSessionRepository.existsById(sessionId)) {
            deleteSession(sessionId);
        }

        // API Key 진단 로깅
        logApiKeyDiagnostics("createTestSession");

        log.info("Building Gemini Client for test session using GOOGLE_API_KEY environment variable");
        Client client;
        try {
            // API 키를 환경변수에서 읽어서 명시적으로 전달
            String apiKey = System.getenv("GOOGLE_API_KEY");
            if (apiKey == null || apiKey.isEmpty()) {
                throw new IllegalStateException("GOOGLE_API_KEY environment variable is not set");
            }
            log.info("GOOGLE_API_KEY found: {}****", apiKey.substring(0, 4));

            // SDK에 API 키를 명시적으로 전달
            client = Client.builder().apiKey(apiKey).build();
            log.info("✅ Client created with API key for test session");
            log.info("Client object created: {}", client != null ? "NOT NULL" : "NULL");

            clientCache.put(sessionId, client);
            log.info("Created Gemini Client for test session: {}", sessionId);
        } catch (Exception e) {
            log.error("❌ Failed to create Gemini Client for test session: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Hint: Make sure GOOGLE_API_KEY environment variable is set");
            throw e;
        }

        ChatSession session = ChatSession.builder()
                .sessionId(sessionId)
                .sessionMode("test")
                .tutorLevel(tutorLevel)
                .userName(userName)
                .reviewCardId(reviewCardId)
                .reviewQuestions(reviewQuestions)
                .createdAt(LocalDateTime.now())
                .ttl(SESSION_TTL)
                .build();

        chatSessionRepository.save(session);
        log.info("Created test session: {} for user: {} with tutor level: {}", sessionId, userName, tutorLevel);

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

    public ChatSession getSessionByUserId(Long userId) {
        String sessionId = "user-" + userId;
        return getSession(sessionId);
    }

    public void deleteSessionByUserId(Long userId) {
        String sessionId = "user-" + userId;
        deleteSession(sessionId);
    }

    public ChatSession getSessionByReviewCardIdAndUserId(Long reviewCardId, Long userId) {
        log.debug("Getting session by reviewCardId: {} for userId: {}", reviewCardId, userId);

        ChatSession session = chatSessionRepository.findByReviewCardId(reviewCardId)
                .orElseThrow(() -> {
                    log.warn("Session not found for reviewCardId: {}", reviewCardId);
                    return new SessionNotFoundException("해당 복습 카드의 세션을 찾을 수 없습니다: " + reviewCardId);
                });

        String expectedSessionId = "user-" + userId;
        if (!expectedSessionId.equals(session.getSessionId())) {
            log.warn("Session ownership mismatch - reviewCardId: {}, expected userId: {}, actual sessionId: {}",
                    reviewCardId, userId, session.getSessionId());
            throw new SessionNotFoundException("세션에 접근할 권한이 없습니다.");
        }

        log.info("Retrieved session for reviewCardId: {} and userId: {}", reviewCardId, userId);
        return session;
    }

    /**
     * API Key 로딩 상태를 진단하고 로그를 출력하는 메서드
     */
    private void logApiKeyDiagnostics(String context) {
        log.info("=== [{}] API Key Diagnostics ===", context);

        // 1. GOOGLE_API_KEY 환경변수 확인 (SDK가 사용하는 표준 환경변수)
        String googleApiKey = System.getenv("GOOGLE_API_KEY");
        log.info("1. Environment Variable GOOGLE_API_KEY (used by SDK):");
        if (googleApiKey != null) {
            log.info("   ✅ FOUND");
            log.info("   - Length: {}", googleApiKey.length());
            log.info("   - Preview: {}****", googleApiKey.length() > 4 ? googleApiKey.substring(0, 4) : "TOO_SHORT");

            // API 키 형식 검증
            if (googleApiKey.length() < 20) {
                log.warn("   ⚠️  WARNING: API key seems too short");
            }
            if (!googleApiKey.startsWith("AIza")) {
                log.warn("   ⚠️  WARNING: Google Gemini API keys typically start with 'AIza'");
            }
        } else {
            log.error("   ❌ NOT FOUND - GOOGLE_API_KEY environment variable is not set!");
            log.error("   - This will cause Gemini API calls to fail");
            log.error("   - Set GOOGLE_API_KEY in docker-compose.prod.yml");
        }

        // 2. AI_API_KEY 환경변수 확인 (레거시, 참고용)
        String aiApiKey = System.getenv("AI_API_KEY");
        log.info("2. Environment Variable AI_API_KEY (legacy):");
        if (aiApiKey != null) {
            log.info("   ✅ Found (length: {})", aiApiKey.length());
            // GOOGLE_API_KEY와 비교
            if (googleApiKey != null && !googleApiKey.equals(aiApiKey)) {
                log.warn("   ⚠️  WARNING: AI_API_KEY and GOOGLE_API_KEY have different values!");
            }
        } else {
            log.info("   - Not set (this is OK, GOOGLE_API_KEY is used instead)");
        }

        // 3. 최종 상태
        log.info("3. Status Summary:");
        if (googleApiKey != null && googleApiKey.length() > 20) {
            log.info("   ✅ READY - Gemini API calls should work");
        } else {
            log.error("   ❌ NOT READY - Gemini API calls will fail");
        }

        log.info("=== End of API Key Diagnostics ===");
    }
}
