package algorithm_note.algorithm_note_v2.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequestDto {
    private String email;
    private String firstName;
    private String lastName;

    public static UserUpdateRequestDto of(String email, String firstName, String lastName) {
        return new UserUpdateRequestDto(email, firstName, lastName);
    }
}