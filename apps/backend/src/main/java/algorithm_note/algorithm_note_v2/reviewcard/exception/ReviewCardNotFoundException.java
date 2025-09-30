package algorithm_note.algorithm_note_v2.reviewcard.exception;

/**
 * 복습 카드를 찾을 수 없을 때 발생하는 예외
 */
public class ReviewCardNotFoundException extends RuntimeException {

    public ReviewCardNotFoundException(String message) {
        super(message);
    }

    public ReviewCardNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}