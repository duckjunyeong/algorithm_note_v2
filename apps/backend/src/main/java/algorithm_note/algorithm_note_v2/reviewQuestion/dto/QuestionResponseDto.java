package algorithm_note.algorithm_note_v2.reviewQuestion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI 질문 생성 응답 DTO
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponseDto {

  @JsonProperty("title")
  private String title;

  @JsonProperty("questions")
  private List<QuestionItem> questions;
}