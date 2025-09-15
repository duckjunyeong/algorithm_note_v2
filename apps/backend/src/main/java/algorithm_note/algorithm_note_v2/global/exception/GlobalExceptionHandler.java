package algorithm_note.algorithm_note_v2.global.exception;

import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookResponseDto;
import com.svix.exceptions.WebhookVerificationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ClerkWebhookResponseDto.failure(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ClerkWebhookResponseDto> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ClerkWebhookResponseDto.failure("Internal server error"));
    }
}