package algorithm_note.algorithm_note_v2.global.exception;

/**
 * Exception thrown when JWT token verification fails.
 */
public class JwtVerificationException extends RuntimeException {

    public JwtVerificationException(String message) {
        super(message);
    }

    public JwtVerificationException(String message, Throwable cause) {
        super(message, cause);
    }
}