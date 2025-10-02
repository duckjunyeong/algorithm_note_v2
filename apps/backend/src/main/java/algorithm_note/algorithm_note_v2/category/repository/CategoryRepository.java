package algorithm_note.algorithm_note_v2.category.repository;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Category Repository for database operations.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find all categories for a specific user, ordered by creation date (newest first).
     *
     * @param user User entity
     * @return List of categories
     */
    List<Category> findAllByUserOrderByCreatedAtDesc(User user);

    /**
     * Find a category by user and name (for duplicate checking).
     *
     * @param user User entity
     * @param name Category name
     * @return Optional Category
     */
    Optional<Category> findByUserAndName(User user, String name);

    /**
     * Find a category by ID and user (for authorization check).
     *
     * @param categoryId Category ID
     * @param user User entity
     * @return Optional Category
     */
    Optional<Category> findByCategoryIdAndUser(Long categoryId, User user);

    /**
     * Check if a category with the given name exists for the user.
     *
     * @param user User entity
     * @param name Category name
     * @return true if exists, false otherwise
     */
    boolean existsByUserAndName(User user, String name);
}
