package algorithm_note.algorithm_note_v2.problem.exception;

/**
 * Exception thrown when Redis operations fail.
 */
public class RedisOperationException extends RuntimeException {

    public RedisOperationException(String message) {
        super(message);
    }

    public RedisOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}