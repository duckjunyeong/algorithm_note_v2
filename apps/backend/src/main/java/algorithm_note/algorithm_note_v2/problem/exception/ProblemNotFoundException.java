package algorithm_note.algorithm_note_v2.problem.exception;

/**
 * Exception thrown when a problem is not found.
 */
public class ProblemNotFoundException extends RuntimeException {

    public ProblemNotFoundException(String message) {
        super(message);
    }

    public ProblemNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}