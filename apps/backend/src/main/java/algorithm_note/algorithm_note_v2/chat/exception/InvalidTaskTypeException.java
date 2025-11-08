package algorithm_note.algorithm_note_v2.chat.exception;

public class InvalidTaskTypeException extends RuntimeException {

    public InvalidTaskTypeException(String message) {
        super(message);
    }

    public InvalidTaskTypeException(String message, Throwable cause) {
        super(message, cause);
    }
}
