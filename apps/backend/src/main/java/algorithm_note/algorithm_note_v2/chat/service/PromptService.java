package algorithm_note.algorithm_note_v2.chat.service;

import algorithm_note.algorithm_note_v2.chat.exception.InvalidTaskTypeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PromptService {

    @Value("${ai.prompt.concept-question-generator}")
    private String conceptPrompt;

    @Value("${ai.prompt.memorization-question-generator}")
    private String memorizationPrompt;

    @Value("${ai.prompt.approach-question-generator}")
    private String approachPrompt;

    public String getPromptByTaskType(String taskType) {
        return switch (taskType.toLowerCase()) {
            case "concept" -> conceptPrompt;
            case "memorization" -> memorizationPrompt;
            case "approach" -> approachPrompt;
            default -> {
                log.error("Invalid task type: {}", taskType);
                throw new InvalidTaskTypeException("유효하지 않은 태스크 유형입니다: " + taskType);
            }
        };
    }

    public String formatPrompt(String taskType, String userName, String taskField) {
        String prompt = getPromptByTaskType(taskType);

        // Prepare values for String.format
        String formattedUserName = userName != null ? userName : "사용자";
        String formattedDomain = (taskField != null && !taskField.trim().isEmpty()) ? taskField : "NULL";

        // Use String.format to replace %s placeholders
        prompt = String.format(prompt, formattedUserName, formattedDomain);

        log.debug("Formatted prompt for taskType: {}, userName: {}, taskField: {}",
                taskType, userName, taskField);

        return prompt;
    }
}
