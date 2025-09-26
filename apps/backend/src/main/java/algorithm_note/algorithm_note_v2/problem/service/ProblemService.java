package algorithm_note.algorithm_note_v2.problem.service;

import algorithm_note.algorithm_note_v2.problem.domain.Problem;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemManualRequestDto;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemScrapingException;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemValidationException;
import algorithm_note.algorithm_note_v2.problem.exception.RedisOperationException;
import algorithm_note.algorithm_note_v2.problem.repository.ProblemRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import algorithm_note.algorithm_note_v2.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Service for handling problem-related business logic.
 * Manages problem scraping, Redis caching, and database operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String REDIS_KEY_PREFIX = "problem:temp:";
    private static final long REDIS_TTL_HOURS = 24;

    /**
     * Scrapes problem data from Baekjoon URL and stores it temporarily in Redis.
     *
     * @param url The Baekjoon problem URL
     * @param userId The user ID from JWT token
     */
    @Transactional
    public void registerProblemFromUrl(String url, String userId) {
        try {
            log.info("Starting problem scraping for URL: {}", url);

            // Check if problem already exists
            if (problemRepository.existsByUrl(url)) {
                throw new ProblemValidationException("Problem with this URL already exists");
            }

            // Scrape problem data
            ProblemDto problemDto = scrapeProblemData(url);

            // Store in Redis
            storeInRedis(userId, problemDto);

            log.info("Successfully scraped and cached problem for user: {}", userId);

        } catch (IOException e) {
            log.error("Failed to scrape problem from URL: {}", url, e);
            throw new ProblemScrapingException("Failed to access or parse the problem page");
        } catch (Exception e) {
            log.error("Unexpected error during problem registration: {}", e.getMessage(), e);
            throw new ProblemScrapingException("Problem registration failed: " + e.getMessage());
        }
    }

    /**
     * Registers problem from manual input and stores it temporarily in Redis.
     *
     * @param request The manual problem data
     * @param userId The user ID from JWT token
     */
    @Transactional
    public void registerProblemFromManualInput(ProblemManualRequestDto request, String userId) {
        try {
            log.info("Registering manual problem for user: {}", userId);

            // Validate required fields
            validateManualProblemData(request);

            // Create ProblemDto from request
            ProblemDto problemDto = ProblemDto.fromManualRequest(request);

            // Store in Redis
            storeInRedis(userId, problemDto);

            log.info("Successfully registered manual problem for user: {}", userId);

        } catch (Exception e) {
            log.error("Failed to register manual problem: {}", e.getMessage(), e);
            throw new ProblemValidationException("Manual problem registration failed: " + e.getMessage());
        }
    }

    /**
     * Retrieves problem data from Redis cache.
     *
     * @param userId The user ID
     * @return ProblemDto if found, null otherwise
     */
    public ProblemDto getFromRedis(String userId) {
        try {
            String key = REDIS_KEY_PREFIX + userId;
            Object cachedData = redisTemplate.opsForValue().get(key);

            if (cachedData == null) {
                log.warn("No cached problem data found for user: {}", userId);
                return null;
            }

            return objectMapper.convertValue(cachedData, ProblemDto.class);

        } catch (Exception e) {
            log.error("Failed to retrieve problem data from Redis for user: {}", userId, e);
            throw new RedisOperationException("Failed to retrieve cached problem data");
        }
    }

    /**
     * Permanently saves problem from Redis cache to database.
     *
     * @param userId The user ID
     * @return The saved Problem entity
     */
    @Transactional
    public Problem saveProblemFromCache(String userId) {
        try {
            // Get problem data from Redis
            ProblemDto problemDto = getFromRedis(userId);
            if (problemDto == null) {
                throw new ProblemValidationException("No cached problem data found for user");
            }

            // Get user entity
            User user = userRepository.findByClerkId(userId)
                    .orElseThrow(() -> new ProblemValidationException("User not found"));

            // Create Problem entity
            Problem problem = Problem.builder()
                    .title(problemDto.getTitle())
                    .description(problemDto.getDescription())
                    .inputCondition(problemDto.getInputCondition())
                    .outputCondition(problemDto.getOutputCondition())
                    .constraints(problemDto.getConstraints())
                    .url(problemDto.getUrl())
                    .user(user)
                    .build();

            // Save to database
            Problem savedProblem = problemRepository.save(problem);

            // Remove from Redis cache
            removeFromRedis(userId);

            log.info("Successfully saved problem to database for user: {}", userId);
            return savedProblem;

        } catch (Exception e) {
            log.error("Failed to save problem from cache: {}", e.getMessage(), e);
            throw new ProblemValidationException("Failed to save problem: " + e.getMessage());
        }
    }

    /**
     * Scrapes problem data from Baekjoon URL.
     */
    private ProblemDto scrapeProblemData(String url) throws IOException {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();

        // Extract problem data using CSS selectors
        String title = extractTextContent(doc, "#problem_title");
        if (title == null || title.trim().isEmpty()) {
            throw new ProblemScrapingException("Failed to extract problem title");
        }

        String description = extractTextContent(doc, "#problem_description");
        if (description == null) {
            description = extractTextContent(doc, "#description");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new ProblemScrapingException("Failed to extract problem description");
        }

        String inputCondition = extractTextContent(doc, "#problem_input");
        if (inputCondition == null) {
            inputCondition = extractTextContent(doc, "#input");
        }
        if (inputCondition == null || inputCondition.trim().isEmpty()) {
            throw new ProblemScrapingException("Failed to extract input condition");
        }

        String outputCondition = extractTextContent(doc, "#problem_output");
        if (outputCondition == null) {
            outputCondition = extractTextContent(doc, "#output");
        }
        if (outputCondition == null || outputCondition.trim().isEmpty()) {
            throw new ProblemScrapingException("Failed to extract output condition");
        }

        // Optional: constraints
        String constraints = extractTextContent(doc, "#problem_limit");
        if (constraints == null) {
            constraints = extractTextContent(doc, "#limit");
        }

        return ProblemDto.fromScrapedData(title, description, inputCondition,
                                        outputCondition, constraints, url);
    }

    /**
     * Extracts text content from document using CSS selector.
     */
    private String extractTextContent(Document doc, String selector) {
        Element element = doc.selectFirst(selector);
        return element != null ? element.text() : null;
    }

    /**
     * Validates manual problem data.
     */
    private void validateManualProblemData(ProblemManualRequestDto request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ProblemValidationException("Problem title is required");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new ProblemValidationException("Problem description is required");
        }
        if (request.getInputCondition() == null || request.getInputCondition().trim().isEmpty()) {
            throw new ProblemValidationException("Input condition is required");
        }
        if (request.getOutputCondition() == null || request.getOutputCondition().trim().isEmpty()) {
            throw new ProblemValidationException("Output condition is required");
        }
    }

    /**
     * Stores problem data in Redis with TTL.
     */
    private void storeInRedis(String userId, ProblemDto problemDto) {
        try {
            String key = REDIS_KEY_PREFIX + userId;
            redisTemplate.opsForValue().set(key, problemDto, REDIS_TTL_HOURS, TimeUnit.HOURS);

            log.debug("Stored problem data in Redis with key: {}", key);
        } catch (Exception e) {
            log.error("Failed to store problem data in Redis: {}", e.getMessage(), e);
            throw new RedisOperationException("Failed to cache problem data");
        }
    }

    /**
     * Removes problem data from Redis cache.
     */
    private void removeFromRedis(String userId) {
        try {
            String key = REDIS_KEY_PREFIX + userId;
            redisTemplate.delete(key);

            log.debug("Removed problem data from Redis with key: {}", key);
        } catch (Exception e) {
            log.warn("Failed to remove problem data from Redis: {}", e.getMessage());
            // Don't throw exception here as the main operation succeeded
        }
    }
}