package algorithm_note.algorithm_note_v2.category.repository;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByUserOrderByCreatedAtDesc(User user);

    Optional<Category> findByUserAndName(User user, String name);

    Optional<Category> findByCategoryIdAndUser(Long categoryId, User user);

    boolean existsByUserAndName(User user, String name);

    boolean existsByUserAndColor(User user, String color);
}
