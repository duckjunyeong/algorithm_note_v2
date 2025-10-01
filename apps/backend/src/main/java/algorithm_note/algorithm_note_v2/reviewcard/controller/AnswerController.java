package algorithm_note.algorithm_note_v2.reviewcard.controller;

import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerCreateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerCreateResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.service.AnswerService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Answer REST API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    /**
     * 답변을 생성합니다.
     *
     * @param requestDto 답변 생성 요청 DTO
     * @param user 인증된 사용자
     * @return 생성된 답변 정보
     */
    @PostMapping("/create")
    public ResponseEntity<AnswerCreateResponseDto> createAnswer(
            @Valid @RequestBody AnswerCreateRequestDto requestDto,
            @AuthenticationPrincipal User user) {

        log.info("POST /api/answers/create - user: {}, questionId: {}",
                user.getId(), requestDto.getQuestionId());

        AnswerCreateResponseDto response = answerService.createAnswer(requestDto, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 특정 질문에 대한 모든 답변을 조회합니다.
     *
     * @param questionId 복습 질문 ID
     * @param user 인증된 사용자
     * @return 답변 목록 (최신순)
     */
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<AnswerResponseDto>> getAnswersByQuestion(
            @PathVariable Long questionId,
            @AuthenticationPrincipal User user) {

        log.info("GET /api/answers/question/{} - user: {}", questionId, user.getId());

        List<AnswerResponseDto> answers = answerService.getAnswersByQuestionId(questionId, user);

        return ResponseEntity.ok(answers);
    }
}
