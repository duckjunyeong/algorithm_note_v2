package algorithm_note.algorithm_note_v2.chat.repository;

import algorithm_note.algorithm_note_v2.chat.entity.ChatSession;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSessionRepository extends CrudRepository<ChatSession, String> {

}
