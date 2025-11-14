package algorithm_note.algorithm_note_v2.chat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RedisHash("chatSession")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession implements Serializable {
    @Id
    private String sessionId;

    private String taskType;

    private String taskField;

    private String userName;

    @Builder.Default
    private List<ChatMessage> conversationHistory = new ArrayList<>();

    private LocalDateTime createdAt;

    @TimeToLive
    private Long ttl;

    private String sessionMode;

    private String tutorLevel;

    private Long reviewCardId;

    @Builder.Default
    private List<String> reviewQuestions = new ArrayList<>();

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessage implements Serializable {
        private String role;

        private String content;

        private LocalDateTime timestamp;

        public static ChatMessage user(String content) {
            return ChatMessage.builder()
                    .role("user")
                    .content(content)
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        public static ChatMessage assistant(String content) {
            return ChatMessage.builder()
                    .role("model")
                    .content(content)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    public void addUserMessage(String content) {
        this.conversationHistory.add(ChatMessage.user(content));
    }

    public void addAssistantMessage(String content) {
        this.conversationHistory.add(ChatMessage.assistant(content));
    }
}
