package algorithm_note.algorithm_note_v2.problem.exception;

/**
 * Exception thrown when problem scraping fails.
 */
public class ProblemScrapingException extends RuntimeException {

    public ProblemScrapingException(String message) {
        super(message);
    }

    public ProblemScrapingException(String message, Throwable cause) {
        super(message, cause);
    }
}