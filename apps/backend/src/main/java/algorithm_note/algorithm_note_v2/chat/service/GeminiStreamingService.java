package algorithm_note.algorithm_note_v2.chat.service;

import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import com.google.genai.Client;
import com.google.genai.ResponseStream;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiStreamingService {

    private static final String MODEL_ID = "gemini-2.5-flash";

    public ResponseStream<GenerateContentResponse> streamResponse(
        Client client,
        ChatSession session,
        String systemPrompt,
        String userMessage) {

        GenerateContentConfig config = GenerateContentConfig.builder()
            .systemInstruction(Content.fromParts(Part.fromText(systemPrompt)))
            .build();

        List<Content> conversationContents = buildConversationHistory(session, userMessage);

        log.debug("Streaming response for session: {} with {} messages",
            session.getSessionId(), conversationContents.size());

        return client.models.generateContentStream(MODEL_ID, conversationContents, config);
    }

    private List<Content> buildConversationHistory(ChatSession session, String userMessage) {
        List<Content> contents = new ArrayList<>();

        for (ChatSession.ChatMessage msg : session.getConversationHistory()) {

            String role = msg.getRole();
            if ("bot".equals(role)) {
                role = "model";
            }
            Content content = Content.builder()
                .role(role) // 수정된 role 변수를 사용합니다.
                .parts(List.of(Part.fromText(msg.getContent())))
                .build();
            contents.add(content);
        }

        Content userContent = Content.builder()
            .role("user")
            .parts(List.of(Part.fromText(userMessage)))
            .build();
        contents.add(userContent);

        return contents;
    }

    public String extractText(GenerateContentResponse response) {
        try {
            String text = response.text();
            return text != null ? text : "";
        } catch (Exception e) {
            log.warn("Failed to extract text from response: {}", e.getMessage());
            return "";
        }
    }
}