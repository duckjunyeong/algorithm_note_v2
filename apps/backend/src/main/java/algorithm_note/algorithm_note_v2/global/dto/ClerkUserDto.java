package algorithm_note.algorithm_note_v2.global.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClerkUserDto {

    @JsonProperty("id")
    private String id;

    @JsonProperty("email_addresses")
    private EmailAddress[] emailAddresses;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    @JsonProperty("created_at")
    private Long createdAt;

    @JsonProperty("updated_at")
    private Long updatedAt;

    public static ClerkUserDto of(String id, EmailAddress[] emailAddresses, String firstName,
                                 String lastName, Long createdAt, Long updatedAt) {
        return new ClerkUserDto(id, emailAddresses, firstName, lastName, createdAt, updatedAt);
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmailAddress {

        @JsonProperty("email_address")
        private String emailAddress;

        @JsonProperty("verification")
        private Verification verification;

        public static EmailAddress of(String emailAddress, Verification verification) {
            return new EmailAddress(emailAddress, verification);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Verification {

        @JsonProperty("status")
        private String status;

        public static Verification of(String status) {
            return new Verification(status);
        }
    }
}