package algorithm_note.algorithm_note_v2.reviewQuestion.exception;


public class ReviewQuestionNotFoundException extends RuntimeException {

    public ReviewQuestionNotFoundException(String message) {
        super(message);
    }

    public ReviewQuestionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
