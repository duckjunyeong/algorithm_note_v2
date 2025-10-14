package algorithm_note.algorithm_note_v2.user.repository;

import algorithm_note.algorithm_note_v2.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId);
}