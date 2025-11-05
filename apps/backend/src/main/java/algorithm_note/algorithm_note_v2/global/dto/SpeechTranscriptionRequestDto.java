package algorithm_note.algorithm_note_v2.global.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeechTranscriptionRequestDto {

    @NotBlank(message = "GCS 경로는 필수입니다")
    @Pattern(regexp = "^gs://[a-zA-Z0-9_-]+/.*", message = "올바른 GCS 경로가 아닙니다 (gs://bucket/path 형식)")
    private String gcsPath;
}
