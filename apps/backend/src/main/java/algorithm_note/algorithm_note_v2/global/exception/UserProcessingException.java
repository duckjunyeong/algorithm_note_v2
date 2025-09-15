package algorithm_note.algorithm_note_v2.global.exception;

public class UserProcessingException extends RuntimeException {

    public UserProcessingException(String message) {
        super(message);
    }

    public UserProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}