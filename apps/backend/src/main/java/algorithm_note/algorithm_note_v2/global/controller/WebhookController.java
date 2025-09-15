package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookEventDto;
import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookResponseDto;
import algorithm_note.algorithm_note_v2.global.service.ClerkUserService;
import algorithm_note.algorithm_note_v2.global.service.ClerkWebhookVerificationService; // 새로 만든 서비스 import
import com.fasterxml.jackson.databind.ObjectMapper;
import com.svix.exceptions.WebhookVerificationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final ClerkWebhookVerificationService verificationService;
    private final ClerkUserService clerkUserService;
    private final ObjectMapper objectMapper;

    @PostMapping("/clerk")
    public ResponseEntity<ClerkWebhookResponseDto> handleClerkWebhook( @RequestHeader Map<String,String> header, // Map으로 헤더를 받음
                                                                       @RequestBody String payload) {
        log.info("header: {}", header);
        log.info("payload: {}", payload);

        try {

            verificationService.verify(payload, header);

            ClerkWebhookEventDto webhookEvent = objectMapper.readValue(payload, ClerkWebhookEventDto.class);
            log.info("Successfully verified Clerk webhook event: {}", webhookEvent.getType());

            if ("user.created".equals(webhookEvent.getType())) {
                return handleUserCreatedEvent(webhookEvent);
            }

            log.info("Webhook event type {} not processed", webhookEvent.getType());
            return ResponseEntity.ok(
                ClerkWebhookResponseDto.success("Event received but not processed", null, null));

        } catch (WebhookVerificationException e) {
            log.warn("Webhook verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ClerkWebhookResponseDto.failure("Invalid webhook signature"));
        } catch (Exception e) {
            log.error("Error processing Clerk webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ClerkWebhookResponseDto.failure("Internal server error processing webhook"));
        }
    }

    private ResponseEntity<ClerkWebhookResponseDto> handleUserCreatedEvent(ClerkWebhookEventDto webhookEvent) {
        try {
            String userId = webhookEvent.getData().getId();
            if (userId == null || userId.isEmpty()) {
                log.warn("User ID is missing in webhook event");
                return ResponseEntity.badRequest()
                    .body(ClerkWebhookResponseDto.failure("User ID is missing"));
            }

            boolean roleAssigned = clerkUserService.assignDefaultRole(userId);

            if (roleAssigned) {
                log.info("Successfully processed user creation for user: {}", userId);
                return ResponseEntity.ok(
                    ClerkWebhookResponseDto.success("User processed successfully", userId, "member")
                );
            } else {
                log.warn("Failed to assign role to user: {}", userId);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ClerkWebhookResponseDto.failure("Failed to assign user role"));
            }

        } catch (Exception e) {
            log.error("Error handling user creation event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ClerkWebhookResponseDto.failure("Error processing user creation"));
        }
    }
}