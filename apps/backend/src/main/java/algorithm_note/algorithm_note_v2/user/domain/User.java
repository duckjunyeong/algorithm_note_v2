package algorithm_note.algorithm_note_v2.user.domain;

import algorithm_note.algorithm_note_v2.problem.domain.Problem;
import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity representing application users linked to Clerk authentication.
 */
@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, name = "clerk_id")
    private String clerkId;

    @Column(nullable = false)
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<Problem> problems = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<ReviewCard> reviewCards = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Updates user information from JWT claims.
     *
     * @param email User's email address
     * @param firstName User's first name
     * @param lastName User's last name
     * @return Updated User entity for method chaining
     */
    public User updateFromJwtClaims(String email, String firstName, String lastName) {
        return User.builder()
                .id(this.id)
                .clerkId(this.clerkId)
                .email(email != null ? email : this.email)
                .firstName(firstName != null ? firstName : this.firstName)
                .lastName(lastName != null ? lastName : this.lastName)
                .createdAt(this.createdAt)
                .updatedAt(LocalDateTime.now())
                .build();
    }
}