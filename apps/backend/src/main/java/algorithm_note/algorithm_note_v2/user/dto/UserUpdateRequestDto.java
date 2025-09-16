package algorithm_note.algorithm_note_v2.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO for user update request.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequestDto {
    private String email;
    private String firstName;
    private String lastName;

    /**
     * Creates a user update request DTO.
     * @param email The user's email address
     * @param firstName The user's first name
     * @param lastName The user's last name
     * @return A DTO for user update
     */
    public static UserUpdateRequestDto of(String email, String firstName, String lastName) {
        return new UserUpdateRequestDto(email, firstName, lastName);
    }
}