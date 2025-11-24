package algorithm_note.algorithm_note_v2.chat.service;

import algorithm_note.algorithm_note_v2.chat.exception.InvalidTaskTypeException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PromptService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.prompt.concept-question-generator}")
    private String conceptPrompt;

    @Value("${ai.prompt.memorization-question-generator}")
    private String memorizationPrompt;

    @Value("${ai.prompt.approach-question-generator}")
    private String approachPrompt;

    @Value("${ai.prompt.beginner-tutor}")
    private String beginnerTutorPrompt;

    @Value("${ai.prompt.advanced-tutor}")
    private String advancedTutorPrompt;

    @Value("${ai.prompt.professor-tutor}")
    private String professorTutorPrompt;

    @Value("${ai.prompt.normal-tutor}")
    private String normalTutorPrompt;

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

        String formattedUserName = userName != null ? userName : "사용자";
        String formattedDomain = (taskField != null && !taskField.trim().isEmpty()) ? taskField : "NULL";

        Map<String, String> variables = new HashMap<>();
        variables.put("USER_NAME", formattedUserName);
        variables.put("DOMAIN", formattedDomain);

        prompt = replaceTemplateVariables(prompt, variables);

        log.debug("Formatted prompt for taskType: {}, userName: {}, taskField: {}",
                taskType, userName, taskField);

        return prompt;
    }

    public String formatTestPrompt(String tutorLevel, String userName, List<String> reviewQuestions) {
        String prompt = getTutorPromptByLevel(tutorLevel);

        String formattedUserName = userName != null ? userName : "사용자";
        String formattedQuestions = formatQuestionsAsJson(reviewQuestions);

        Map<String, String> variables = new HashMap<>();
        variables.put("USER_NAME", formattedUserName);
        variables.put("REVIEW_QUESTIONS", formattedQuestions);

        prompt = replaceTemplateVariables(prompt, variables);

        log.debug("Formatted test prompt for tutorLevel: {}, userName: {}, questionCount: {}",
                tutorLevel, userName, reviewQuestions.size());

        return prompt;
    }

    private String getTutorPromptByLevel(String tutorLevel) {
        return switch (tutorLevel.toLowerCase()) {
            case "beginner" -> beginnerTutorPrompt;
            case "advanced" -> advancedTutorPrompt;
            case "professor" -> professorTutorPrompt;
            case "normal" -> normalTutorPrompt;
            default -> {
                log.error("Invalid tutor level: {}", tutorLevel);
                throw new InvalidTaskTypeException("유효하지 않은 튜터 레벨입니다: " + tutorLevel);
            }
        };
    }

    private String formatQuestionsAsJson(List<String> questions) {
        try {
            return objectMapper.writeValueAsString(questions);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize questions to JSON", e);
            return "[]";
        }
    }

    private String replaceTemplateVariables(String template, Map<String, String> variables) {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue();

            if (result.contains(placeholder)) {
                result = result.replace(placeholder, value);
                log.debug("Replaced template variable: {} -> {}", placeholder, value);
            } else {
                log.warn("Template variable not found in prompt: {}", placeholder);
            }
        }

        // Check for any remaining unreplaced variables
        if (result.contains("{{") && result.contains("}}")) {
            log.warn("Prompt still contains unreplaced template variables. Please check the template format.");
        }

        return result;
    }
}
