package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.config.WebhookProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for interacting with Clerk API to manage user metadata.
 */
@Slf4j
@Service
public class ClerkUserService {

    private final WebClient webClient;

    public ClerkUserService(@Value("${clerk.secret.key}") String clerkSecretKey) {
        log.info("Loaded Clerk Secret Key: '{}'", clerkSecretKey);
        if (clerkSecretKey == null || clerkSecretKey.isBlank()) {
            log.error("Clerk Secret Key is NULL or EMPTY. Check application.properties.");
        }

        this.webClient = WebClient.builder()
            .baseUrl("https://api.clerk.com/v1")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + clerkSecretKey)
            .build();

    }

    public boolean assignDefaultRole(String userId) {
        try {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("role", "member");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("public_metadata", metadata);

            webClient.patch()
                .uri("/users/{id}/metadata", userId)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            return true;
        } catch (Exception e) {
            log.error("Error updating user metadata for user: {} with role: member", userId, e);
            return false;
        }
    }
}