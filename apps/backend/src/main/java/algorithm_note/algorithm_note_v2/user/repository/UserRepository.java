package algorithm_note.algorithm_note_v2.user.repository;

import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their Clerk ID.
     *
     * @param clerkId The unique Clerk identifier
     * @return Optional containing the user if found
     */
    Optional<User> findByClerkId(String clerkId);

    /**
     * Checks if a user exists with the given Clerk ID.
     *
     * @param clerkId The unique Clerk identifier
     * @return true if user exists, false otherwise
     */
    boolean existsByClerkId(String clerkId);
}