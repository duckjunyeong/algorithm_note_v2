package algorithm_note.algorithm_note_v2.reviewQuestion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionItem {

  @JsonProperty("id")
  private Long id;

  @JsonProperty("text")
  private String text;
}