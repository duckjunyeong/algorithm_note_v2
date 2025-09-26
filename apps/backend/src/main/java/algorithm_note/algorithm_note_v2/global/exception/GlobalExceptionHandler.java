package algorithm_note.algorithm_note_v2.global.exception;

import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookResponseDto;
import algorithm_note.algorithm_note_v2.problem.dto.ProblemResponseDto;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemNotFoundException;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemScrapingException;
import algorithm_note.algorithm_note_v2.problem.exception.ProblemValidationException;
import algorithm_note.algorithm_note_v2.problem.exception.RedisOperationException;
import algorithm_note.algorithm_note_v2.user.dto.UserResponseDto;
import algorithm_note.algorithm_note_v2.user.exception.UserNotFoundException;
import com.svix.exceptions.WebhookVerificationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WebhookVerificationException.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleWebhookVerificationException(WebhookVerificationException ex) {
        log.warn("Webhook verification failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ClerkWebhookResponseDto.failure("Invalid webhook signature"));
    }

    @ExceptionHandler(JwtVerificationException.class)
    public ResponseEntity<Map<String, Object>> handleJwtVerificationException(JwtVerificationException ex) {
        log.warn("JWT verification failed: {}", ex.getMessage());
        Map<String, Object> errorResponse = Map.of(
                "error", "Authentication failed",
                "message", ex.getMessage(),
                "status", HttpStatus.UNAUTHORIZED.value()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(UserProcessingException.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleUserProcessingException(UserProcessingException ex) {
        log.error("Error processing user: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ClerkWebhookResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<UserResponseDto> handleUserNotFoundException(UserNotFoundException ex) {
        log.warn("User not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(UserResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ClerkWebhookResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(ProblemNotFoundException.class)
    public ResponseEntity<ProblemResponseDto> handleProblemNotFoundException(ProblemNotFoundException ex) {
        log.warn("Problem not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ProblemResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(ProblemScrapingException.class)
    public ResponseEntity<ProblemResponseDto> handleProblemScrapingException(ProblemScrapingException ex) {
        log.warn("Problem scraping failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ProblemResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(ProblemValidationException.class)
    public ResponseEntity<ProblemResponseDto> handleProblemValidationException(ProblemValidationException ex) {
        log.warn("Problem validation failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ProblemResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(RedisOperationException.class)
    public ResponseEntity<ProblemResponseDto> handleRedisOperationException(RedisOperationException ex) {
        log.error("Redis operation failed: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ProblemResponseDto.failure("Temporary storage operation failed"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        String errorMessage = bindingResult.getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        log.warn("Validation failed: {}", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ProblemResponseDto.failure(errorMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ClerkWebhookResponseDto.failure("Internal server error"));
    }
}