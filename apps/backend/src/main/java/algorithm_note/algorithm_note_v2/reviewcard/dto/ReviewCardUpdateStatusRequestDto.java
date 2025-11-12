package algorithm_note.algorithm_note_v2.reviewcard.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardUpdateStatusRequestDto {

    @NotNull(message = "활성 상태를 입력해주세요")
    private Boolean isActive;
}