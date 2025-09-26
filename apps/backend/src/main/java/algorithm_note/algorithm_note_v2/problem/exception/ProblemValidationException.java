package algorithm_note.algorithm_note_v2.problem.exception;

/**
 * Exception thrown when problem data validation fails.
 */
public class ProblemValidationException extends RuntimeException {

    public ProblemValidationException(String message) {
        super(message);
    }

    public ProblemValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}