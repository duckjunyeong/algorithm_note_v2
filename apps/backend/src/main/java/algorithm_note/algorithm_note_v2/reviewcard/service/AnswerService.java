package algorithm_note.algorithm_note_v2.reviewcard.service;

import algorithm_note.algorithm_note_v2.reviewcard.domain.Answer;
import algorithm_note.algorithm_note_v2.reviewQuestion.domain.ReviewQuestion;
import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerCreateRequestDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerCreateResponseDto;
import algorithm_note.algorithm_note_v2.reviewcard.dto.AnswerResponseDto;
import algorithm_note.algorithm_note_v2.reviewQuestion.exception.ReviewQuestionNotFoundException;
import algorithm_note.algorithm_note_v2.reviewcard.repository.AnswerRepository;
import algorithm_note.algorithm_note_v2.reviewQuestion.repository.ReviewQuestionRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final ReviewQuestionRepository reviewQuestionRepository;

    @Transactional
    public AnswerCreateResponseDto createAnswer(AnswerCreateRequestDto requestDto, User user) {
        log.info("Creating answer for user: {}, questionId: {}", user.getId(), requestDto.getQuestionId());

        ReviewQuestion reviewQuestion = reviewQuestionRepository.findById(requestDto.getQuestionId())
                .orElseThrow(() -> new ReviewQuestionNotFoundException("복습 질문을 찾을 수 없습니다."));

        if (!reviewQuestion.getReviewCard().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 질문에만 답변할 수 있습니다.");
        }

        Answer.EvaluationResult evaluationResult;
        try {
            evaluationResult = Answer.EvaluationResult.valueOf(requestDto.getEvaluationResult().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 평가 결과입니다. SUCCESS 또는 FAILURE만 가능합니다.");
        }

        Answer answer = Answer.createAnswer(reviewQuestion, requestDto.getContent(), evaluationResult);
        Answer savedAnswer = answerRepository.save(answer);

        boolean isSuccess = evaluationResult == Answer.EvaluationResult.SUCCESS;
        reviewQuestion.incrementCount(isSuccess);

        reviewQuestion.getReviewCard().recalculateSuccessRate();

        log.info("Successfully created answer with ID: {}, updated question counts and card success rate",
                savedAnswer.getAnswerId());

        return AnswerCreateResponseDto.success(savedAnswer.getAnswerId());
    }

    public List<AnswerResponseDto> getAnswersByQuestionId(Long questionId, User user) {
        log.info("Fetching answers for questionId: {}, user: {}", questionId, user.getId());

        ReviewQuestion reviewQuestion = reviewQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ReviewQuestionNotFoundException("복습 질문을 찾을 수 없습니다."));

        if (!reviewQuestion.getReviewCard().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 질문에 대한 답변만 조회할 수 있습니다.");
        }

        List<Answer> answers = answerRepository.findAllByReviewQuestion_ReviewQuestionIdOrderByCreatedAtDesc(questionId);

        log.info("Found {} answers for questionId: {}", answers.size(), questionId);

        return answers.stream()
                .map(AnswerResponseDto::from)
                .collect(Collectors.toList());
    }
}
