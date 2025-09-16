package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.global.dto.ClerkUserDto;
import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookEventDto;
import algorithm_note.algorithm_note_v2.global.dto.ClerkWebhookResponseDto;
import algorithm_note.algorithm_note_v2.global.exception.UserProcessingException;
import algorithm_note.algorithm_note_v2.global.service.ClerkUserService;
import algorithm_note.algorithm_note_v2.global.service.ClerkWebhookVerificationService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import algorithm_note.algorithm_note_v2.user.dto.UserRegisterRequestDto;
import algorithm_note.algorithm_note_v2.user.service.UserService;
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
    private final UserService userService;
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
        ClerkUserDto clerkUser = webhookEvent.getData();
        String userId = clerkUser.getId();

        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID is missing in webhook event");
        }

        try {
            // 1. 사용자를 데이터베이스에 등록
            UserRegisterRequestDto userRegistrationData = createUserRegistrationData(clerkUser);
            User savedUser = userService.registerUser(userRegistrationData);
            log.info("Successfully saved user to database: {}", savedUser.getClerkId());

            // 2. Clerk에서 사용자에게 역할 할당
            clerkUserService.assignDefaultRole(userId);
            log.info("Successfully assigned default role to user: {}", userId);

            return ResponseEntity.ok(
                ClerkWebhookResponseDto.success("User processed successfully", userId, "member")
            );
        } catch (IllegalArgumentException ex) {
            // 사용자가 이미 존재하는 경우 등 비즈니스 예외
            log.warn("User registration failed: {}", ex.getMessage());
            return ResponseEntity.ok(
                ClerkWebhookResponseDto.success("User already exists", userId, "member")
            );
        } catch (Exception ex) {
            // 기타 예외는 UserProcessingException으로 변환하여 GlobalExceptionHandler에서 처리
            throw new UserProcessingException("Failed to process user creation for user: " + userId, ex);
        }
    }

    /**
     * Clerk 웹훅 데이터를 UserRegisterRequestDto로 변환합니다.
     */
    private UserRegisterRequestDto createUserRegistrationData(ClerkUserDto clerkUser) {
        String email = extractPrimaryEmail(clerkUser);

        return UserRegisterRequestDto.of(
            clerkUser.getId(),
            email,
            clerkUser.getFirstName(),
            clerkUser.getLastName()
        );
    }

    /**
     * Clerk 사용자 데이터에서 기본 이메일 주소를 추출합니다.
     */
    private String extractPrimaryEmail(ClerkUserDto clerkUser) {
        if (clerkUser.getEmailAddresses() == null || clerkUser.getEmailAddresses().length == 0) {
            throw new IllegalArgumentException("No email addresses found for user: " + clerkUser.getId());
        }

        // 첫 번째 이메일 주소를 기본 이메일로 사용
        ClerkUserDto.EmailAddress primaryEmail = clerkUser.getEmailAddresses()[0];
        if (primaryEmail.getEmailAddress() == null || primaryEmail.getEmailAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Primary email address is empty for user: " + clerkUser.getId());
        }

        return primaryEmail.getEmailAddress();
    }
}