package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", false,
                    "message", "No user found in security context"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", Map.of(
                        "id", user.getId(),
                        "clerkId", user.getClerkId(),
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "createdAt", user.getCreatedAt(),
                        "updatedAt", user.getUpdatedAt()
                )
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "message", "JWT authentication is working"
        ));
    }
}