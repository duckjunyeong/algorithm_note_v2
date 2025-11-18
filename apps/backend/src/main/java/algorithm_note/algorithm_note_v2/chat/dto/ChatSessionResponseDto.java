package algorithm_note.algorithm_note_v2.chat.dto;

import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatSessionResponseDto {

    private String sessionId;

    private String taskType;

    private String taskField;

    private String userName;

    private List<ConversationMessage> conversationHistory;

    private String sessionMode;

    private String tutorLevel;

    private Long reviewCardId;

    private List<ReviewQuestionInfo> reviewQuestions;

    private LocalDateTime createdAt;

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewQuestionInfo {
        private Long reviewQuestionId;
        private String questionText;

        public static ReviewQuestionInfo from(ChatSession.ReviewQuestionInfo info) {
            return ReviewQuestionInfo.builder()
                    .reviewQuestionId(info.getReviewQuestionId())
                    .questionText(info.getQuestionText())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ConversationMessage {
        private String role;
        private String content;
        private LocalDateTime timestamp;

        public static ConversationMessage from(ChatSession.ChatMessage message) {
            return ConversationMessage.builder()
                    .role(message.getRole())
                    .content(message.getContent())
                    .timestamp(message.getTimestamp())
                    .build();
        }
    }

    public static ChatSessionResponseDto from(ChatSession session) {
        return ChatSessionResponseDto.builder()
                .sessionId(session.getSessionId())
                .taskType(session.getTaskType())
                .taskField(session.getTaskField())
                .userName(session.getUserName())
                .conversationHistory(
                        session.getConversationHistory().stream()
                                .map(ConversationMessage::from)
                                .collect(Collectors.toList())
                )
                .sessionMode(session.getSessionMode())
                .tutorLevel(session.getTutorLevel())
                .reviewCardId(session.getReviewCardId())
                .reviewQuestions(
                        session.getReviewQuestions().stream()
                                .map(ReviewQuestionInfo::from)
                                .collect(Collectors.toList())
                )
                .createdAt(session.getCreatedAt())
                .build();
    }
}
