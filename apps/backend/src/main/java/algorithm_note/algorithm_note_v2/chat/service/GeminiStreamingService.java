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

        // Client 상태 진단
        log.info("=== Gemini API Call Diagnostics ===");
        log.info("Session: {}", session.getSessionId());
        log.info("Model: {}", MODEL_ID);
        log.info("Client object: {}", client != null ? "NOT NULL" : "NULL");

        if (client != null) {
            // Client 객체의 내부 상태 확인
            try {
                log.info("Client class: {}", client.getClass().getName());
                log.info("Client toString: {}", client.toString());
            } catch (Exception e) {
                log.warn("Could not inspect client: {}", e.getMessage());
            }
        }

        GenerateContentConfig config = GenerateContentConfig.builder()
            .systemInstruction(Content.fromParts(Part.fromText(systemPrompt)))
            .build();

        List<Content> conversationContents = buildConversationHistory(session, userMessage);

        log.info("Conversation history size: {} messages", conversationContents.size());
        log.info("System prompt length: {} characters", systemPrompt != null ? systemPrompt.length() : 0);
        log.info("Calling generateContentStream...");

        try {
            ResponseStream<GenerateContentResponse> stream =
                client.models.generateContentStream(MODEL_ID, conversationContents, config);
            log.info("✅ Stream created successfully");
            return stream;
        } catch (Exception e) {
            log.error("❌ Failed to create stream: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getName());
            throw e;
        }
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