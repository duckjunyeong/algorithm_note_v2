package algorithm_note.algorithm_note_v2.reviewcard.service;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ThymeleafTemplateDto;
import algorithm_note.algorithm_note_v2.reviewcard.exception.PdfGenerationException;
import algorithm_note.algorithm_note_v2.reviewcard.exception.ReviewCardNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PdfGenerationService {

    private final ReviewCardRepository reviewCardRepository;
    private final SpringTemplateEngine templateEngine;

    public byte[] generatePdfFromReviewCards(
            List<Long> reviewCardIds,
            String examTitle,
            String instruction,
            User user) {

        log.info("Starting PDF generation for ReviewCard IDs: {}", reviewCardIds);

        // 1. ReviewCard 조회 및 권한 검증
        List<ReviewCard> reviewCards = reviewCardIds.stream()
                .map(id -> reviewCardRepository.findByIdAndUserWithQuestions(id, user)
                        .orElseThrow(() -> new ReviewCardNotFoundException(
                                "복습 카드를 찾을 수 없습니다: " + id)))
                .collect(Collectors.toList());

        log.info("Retrieved {} ReviewCards", reviewCards.size());

        // 2. Thymeleaf 템플릿 데이터 준비
        ThymeleafTemplateDto templateDto = ThymeleafTemplateDto.from(
                reviewCards, examTitle, instruction);

        log.info("Prepared template data with {} problems", templateDto.getProblems().size());

        // 3. HTML 렌더링
        Context context = new Context();
        context.setVariable("courseTitle", templateDto.getCourseTitle());
        context.setVariable("examTitle", templateDto.getExamTitle());
        context.setVariable("instruction", templateDto.getInstruction());
        context.setVariable("problems", templateDto.getProblems());

        String html = templateEngine.process("exam/exam", context);
        log.info("HTML rendered successfully");

        // 4. Playwright로 PDF 변환
        byte[] pdfBytes = convertHtmlToPdf(html);
        log.info("PDF generated successfully, size: {} bytes", pdfBytes.length);

        return pdfBytes;
    }

    private byte[] convertHtmlToPdf(String html) {
        try (Playwright playwright = Playwright.create()) {
            log.info("Launching Playwright browser");
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            log.info("Setting HTML content");
            page.setContent(html);

            log.info("Converting to PDF");
            byte[] pdf = page.pdf(new Page.PdfOptions()
                    .setFormat("A4")
                    .setPrintBackground(true));

            browser.close();
            log.info("Browser closed");

            return pdf;

        } catch (Exception e) {
            log.error("Failed to convert HTML to PDF", e);
            throw new PdfGenerationException("PDF 생성 중 오류가 발생했습니다.", e);
        }
    }
}
