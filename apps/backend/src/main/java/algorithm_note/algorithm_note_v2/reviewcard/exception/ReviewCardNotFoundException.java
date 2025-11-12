package algorithm_note.algorithm_note_v2.reviewcard.exception;

public class ReviewCardNotFoundException extends RuntimeException {

    public ReviewCardNotFoundException(String message) {
        super(message);
    }

    public ReviewCardNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}