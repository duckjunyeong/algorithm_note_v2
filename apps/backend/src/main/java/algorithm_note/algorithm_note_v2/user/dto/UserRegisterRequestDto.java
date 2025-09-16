package algorithm_note.algorithm_note_v2.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequestDto {
    private String clerkId;
    private String email;
    private String firstName;
    private String lastName;

    public static UserRegisterRequestDto of(String clerkId, String email, String firstName, String lastName) {
        return new UserRegisterRequestDto(clerkId, email, firstName, lastName);
    }
}