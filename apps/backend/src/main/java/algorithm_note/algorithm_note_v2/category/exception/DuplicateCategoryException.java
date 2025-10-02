package algorithm_note.algorithm_note_v2.category.exception;

/**
 * Exception thrown when attempting to create a duplicate category.
 */
public class DuplicateCategoryException extends RuntimeException {

    public DuplicateCategoryException(String message) {
        super(message);
    }

    public DuplicateCategoryException(String message, Throwable cause) {
        super(message, cause);
    }
}
