package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookEventDto;
import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookResponseDto;
import algorithm_note.algorithm_note_v2.global.exception.UserProcessingException;
import algorithm_note.algorithm_note_v2.global.service.ClerkUserService;
import algorithm_note.algorithm_note_v2.global.service.ClerkWebhookVerificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.svix.exceptions.WebhookVerificationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ClerkWebhookResponseDto> handleClerkWebhook(@RequestHeader Map<String,String> header,
                                                                       @RequestBody String payload) throws WebhookVerificationException, JsonProcessingException {
        log.info("header: {}", header);
        log.info("payload: {}", payload);

        verificationService.verify(payload, header);

        ClerkWebhookEventDto webhookEvent = objectMapper.readValue(payload, ClerkWebhookEventDto.class);
        log.info("Successfully verified Clerk webhook event: {}", webhookEvent.getType());

        if ("user.created".equals(webhookEvent.getType())) {
            return handleUserCreatedEvent(webhookEvent);
        }

        log.info("Webhook event type {} not processed", webhookEvent.getType());
        return ResponseEntity.ok(
            ClerkWebhookResponseDto.success("Event received but not processed", null, null));
    }

    private ResponseEntity<ClerkWebhookResponseDto> handleUserCreatedEvent(ClerkWebhookEventDto webhookEvent) {
        String userId = webhookEvent.getData().getId();
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID is missing in webhook event");
        }

        clerkUserService.assignDefaultRole(userId);

        log.info("Successfully processed user creation for user: {}", userId);
        return ResponseEntity.ok(
            ClerkWebhookResponseDto.success("User processed successfully", userId, "member")
        );
    }
}