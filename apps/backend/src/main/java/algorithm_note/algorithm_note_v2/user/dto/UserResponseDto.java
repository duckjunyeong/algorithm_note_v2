package algorithm_note.algorithm_note_v2.user.dto;

import algorithm_note.algorithm_note_v2.user.domain.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response.
 */
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

    /**
     * Creates a success response DTO from User entity.
     * @param user The User entity
     * @param message The success message
     * @return A DTO representing a success state
     */
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

    /**
     * Creates a success response DTO from User entity with default message.
     * @param user The User entity
     * @return A DTO representing a success state
     */
    public static UserResponseDto success(User user) {
        return success(user, "User operation completed successfully");
    }

    /**
     * Creates a failure response DTO.
     * @param message The failure message
     * @return A DTO representing a failure state
     */
    public static UserResponseDto failure(String message) {
        return new UserResponseDto(null, null, null, null, null, null, null, false, message);
    }
}