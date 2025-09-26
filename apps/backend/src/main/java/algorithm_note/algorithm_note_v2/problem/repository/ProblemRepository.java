package algorithm_note.algorithm_note_v2.problem.repository;

import algorithm_note.algorithm_note_v2.problem.domain.Problem;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Problem entity operations.
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    /**
     * Find all problems by user.
     *
     * @param user The user who owns the problems
     * @return List of problems owned by the user
     */
    List<Problem> findByUser(User user);

    /**
     * Find a problem by its URL.
     *
     * @param url The problem URL
     * @return Optional containing the problem if found
     */
    Optional<Problem> findByUrl(String url);

    /**
     * Check if a problem with the given URL already exists.
     *
     * @param url The problem URL
     * @return true if a problem with the URL exists, false otherwise
     */
    boolean existsByUrl(String url);

    /**
     * Find all problems by user ordered by creation date descending.
     *
     * @param user The user who owns the problems
     * @return List of problems ordered by creation date (newest first)
     */
    List<Problem> findByUserOrderByCreatedAtDesc(User user);
}