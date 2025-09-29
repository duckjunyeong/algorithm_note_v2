package algorithm_note.algorithm_note_v2.problem.service;

import algorithm_note.algorithm_note_v2.global.dto.CoreLogicsResponseDto;
import algorithm_note.algorithm_note_v2.global.service.GeminiClient;
import algorithm_note.algorithm_note_v2.problem.dto.CodeAnalysisRequestDto;
import algorithm_note.algorithm_note_v2.problem.dto.CodeAnalysisResponseDto;
import algorithm_note.algorithm_note_v2.problem.dto.LogicalUnitDto;
import algorithm_note.algorithm_note_v2.problem.dto.LogicAnalyzeRequestDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemDto;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemValidationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for handling code analysis business logic.
 * Manages code analysis flow by retrieving problem data from Redis
 * and sending it to AI for logical flow analysis.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CodeAnalysisService {

    private final ProblemService problemService;
    private final GeminiClient geminiClient;

    /**
     * Analyzes algorithm code and extracts logical flow.
     * Retrieves problem data from Redis cache and sends to Gemini API for analysis.
     *
     * @param request The code analysis request containing language and code
     * @param userId The user ID from JWT token
     * @return Code analysis response with logical units
     */
    @Transactional(readOnly = true)
    public CodeAnalysisResponseDto analyzeCode(CodeAnalysisRequestDto request, String userId) throws JsonProcessingException {
        log.info("Starting code analysis for user: {} with language: {}", userId, request.getLanguage());

        // Validate code is not empty
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            throw new ProblemValidationException("Code cannot be empty");
        }

        // Retrieve problem data from Redis
        ProblemDto problemDto = problemService.getFromRedis(userId);
        if (problemDto == null) {
            throw new ProblemValidationException("No problem data found in cache. Please register a problem first.");
        }

        // Create request for Gemini API
        LogicAnalyzeRequestDto analyzeRequest = LogicAnalyzeRequestDto.builder()
                .description(problemDto.getDescription())
                .input(problemDto.getInputCondition())
                .output(problemDto.getOutputCondition())
                .code(request.getCode())
                .build();

        return geminiClient.getCoreLogics(analyzeRequest);
    }

    /**
     * Converts core logic strings from Gemini API to LogicalUnitDto objects.
     * This method transforms the AI response into structured data.
     *
     * @param coreLogics List of core logic strings from AI
     * @return List of LogicalUnitDto objects
     */
    private List<LogicalUnitDto> convertToLogicalUnits(List<String> coreLogics) {
        List<LogicalUnitDto> logicalUnits = new ArrayList<>();

        for (int i = 0; i < coreLogics.size(); i++) {
            String logic = coreLogics.get(i);

            // Create logical unit with sequential naming
            LogicalUnitDto unit = LogicalUnitDto.builder()
                    .unitName((i + 1) + ". 논리 단위")
                    .description(logic)
                    .specificSteps(List.of(logic)) // For now, use the same content
                    .code("// " + logic) // Placeholder code comment
                    .build();

            logicalUnits.add(unit);
        }

        return logicalUnits;
    }
}