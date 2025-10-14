package algorithm_note.algorithm_note_v2.user.dto;

import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private Long id;
    private String clerkId;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean success;
    private String message;

    public static UserResponseDto success(User user, String message) {
        return new UserResponseDto(
                user.getId(),
                user.getClerkId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                true,
                message
        );
    }

    public static UserResponseDto success(User user) {
        return success(user, "User operation completed successfully");
    }

    public static UserResponseDto failure(String message) {
        return new UserResponseDto(null, null, null, null, null, null, null, false, message);
    }
}