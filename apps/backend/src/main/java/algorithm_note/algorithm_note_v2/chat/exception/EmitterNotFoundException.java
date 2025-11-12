package algorithm_note.algorithm_note_v2.chat.exception;

public class EmitterNotFoundException extends RuntimeException {

    public EmitterNotFoundException() {
        super("SSE connection not found. Please call /subscribe first.");
    }

    public EmitterNotFoundException(String message) {
        super(message);
    }

    public EmitterNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
