package algorithm_note.algorithm_note_v2.reviewcard.exception;

/**
 * PDF 생성 중 오류가 발생할 때 발생하는 예외
 */
public class PdfGenerationException extends RuntimeException {

    public PdfGenerationException(String message) {
        super(message);
    }

    public PdfGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
