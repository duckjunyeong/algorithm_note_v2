package algorithm_note.algorithm_note_v2.reviewQuestion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponseDto {

  @JsonProperty("title")
  private String title;

  @JsonProperty("questions")
  private List<QuestionItem> questions;
}