package algorithm_note.algorithm_note_v2.reviewQuestion.exception;

/**
 * 복습 질문을 찾을 수 없을 때 발생하는 예외
 */
public class ReviewQuestionNotFoundException extends RuntimeException {

    public ReviewQuestionNotFoundException(String message) {
        super(message);
    }

    public ReviewQuestionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
