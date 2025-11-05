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
public class SignedUrlRequestDto {

    @NotBlank(message = "파일명은 필수입니다")
    private String fileName;

    @NotBlank(message = "Content-Type은 필수입니다")
    @Pattern(regexp = "^audio/.*", message = "Content-Type은 audio/* 형식이어야 합니다")
    private String contentType;
}
