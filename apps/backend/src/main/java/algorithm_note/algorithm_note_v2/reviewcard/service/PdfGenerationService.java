package algorithm_note.algorithm_note_v2.reviewcard.service;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewcard.dto.ThymeleafTemplateDto;
import algorithm_note.algorithm_note_v2.reviewcard.exception.PdfGenerationException;
import algorithm_note.algorithm_note_v2.reviewcard.exception.ReviewCardNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.lowagie.text.pdf.BaseFont;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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

        // 4. Flying Saucer로 PDF 변환
        byte[] pdfBytes = convertHtmlToPdf(html);
        log.info("PDF generated successfully, size: {} bytes", pdfBytes.length);

        return pdfBytes;
    }

    private byte[] convertHtmlToPdf(String html) {
        try {
            log.info("Starting HTML to PDF conversion with Flying Saucer");

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();

            // 한글 폰트 등록
            registerKoreanFont(renderer);

            // HTML을 XHTML로 변환하여 설정
            String xhtml = normalizeHtmlToXhtml(html);
            renderer.setDocumentFromString(xhtml);
            renderer.layout();
            renderer.createPDF(outputStream);

            byte[] pdf = outputStream.toByteArray();
            outputStream.close();

            log.info("PDF conversion completed successfully");
            return pdf;

        } catch (Exception e) {
            log.error("Failed to convert HTML to PDF", e);
            throw new PdfGenerationException("PDF 생성 중 오류가 발생했습니다.", e);
        }
    }

    private void registerKoreanFont(ITextRenderer renderer) {
        try {
            // 1. 먼저 리소스에서 폰트 파일 찾기
            ClassPathResource fontResource = new ClassPathResource("fonts/NanumGothic.ttf");

            if (fontResource.exists()) {
                log.info("Found Korean font in resources: fonts/NanumGothic.ttf");

                // ClassPath 리소스를 임시 파일로 복사 (BaseFont는 파일 경로 필요)
                try (InputStream fontStream = fontResource.getInputStream()) {
                    Path tempFontFile = Files.createTempFile("NanumGothic", ".ttf");
                    Files.copy(fontStream, tempFontFile, StandardCopyOption.REPLACE_EXISTING);

                    String fontPath = tempFontFile.toAbsolutePath().toString();
                    renderer.getFontResolver().addFont(
                        fontPath,
                        BaseFont.IDENTITY_H,  // 유니코드 인코딩
                        BaseFont.EMBEDDED     // PDF에 폰트 임베딩
                    );

                    log.info("Successfully registered Korean font: NanumGothic");
                }
            } else {
                log.warn("Korean font file not found in resources. Korean text may not render correctly.");
                log.warn("Please add NanumGothic.ttf to src/main/resources/fonts/ directory");

                // 시스템 폰트 시도 (Windows)
                tryRegisterSystemFont(renderer);
            }
        } catch (Exception e) {
            log.error("Failed to register Korean font", e);
            // 폰트 등록 실패해도 PDF 생성은 계속 진행 (Latin 문자는 표시됨)
        }
    }

    private void tryRegisterSystemFont(ITextRenderer renderer) {
        try {
            // Windows 시스템 폰트 경로들 시도
            String[] systemFontPaths = {
                "C:/Windows/Fonts/malgun.ttf",      // 맑은 고딕
                "C:/Windows/Fonts/gulim.ttc",       // 굴림
                "/usr/share/fonts/truetype/nanum/NanumGothic.ttf", // Linux
                "/System/Library/Fonts/AppleGothic.ttf"            // Mac
            };

            for (String fontPath : systemFontPaths) {
                Path path = Path.of(fontPath);
                if (Files.exists(path)) {
                    renderer.getFontResolver().addFont(
                        fontPath,
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED
                    );
                    log.info("Successfully registered system font: {}", fontPath);
                    return;
                }
            }

            log.warn("No system Korean font found");
        } catch (Exception e) {
            log.error("Failed to register system font", e);
        }
    }

    private String normalizeHtmlToXhtml(String html) {
        // Flying Saucer는 엄격한 XHTML을 요구하므로 HTML을 정규화
        String xhtml = html;

        // 1. Self-closing 태그들을 XHTML 형식으로 변환
        // <meta ...> → <meta ... />
        xhtml = xhtml.replaceAll("<meta([^>]*?)>", "<meta$1 />");
        xhtml = xhtml.replaceAll("<link([^>]*?)>", "<link$1 />");
        xhtml = xhtml.replaceAll("<br>", "<br />");
        xhtml = xhtml.replaceAll("<hr>", "<hr />");
        xhtml = xhtml.replaceAll("<img([^>]*?)>", "<img$1 />");
        xhtml = xhtml.replaceAll("<input([^>]*?)>", "<input$1 />");

        // 2. 이미 />로 끝나는 경우 중복 방지 (// → /)
        xhtml = xhtml.replaceAll("\\s*/\\s*/>", " />");

        // 3. DOCTYPE가 없으면 XHTML DOCTYPE 추가
        if (!xhtml.contains("<!DOCTYPE")) {
            xhtml = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" " +
                   "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                   "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
                   xhtml +
                   "</html>";
        }

        log.debug("Normalized HTML to XHTML");
        return xhtml;
    }
}
