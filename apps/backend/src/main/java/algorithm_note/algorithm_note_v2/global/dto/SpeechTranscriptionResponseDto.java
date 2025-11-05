package algorithm_note.algorithm_note_v2.global.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeechTranscriptionResponseDto {

    private String transcript;      // 음성을 텍스트로 변환한 결과
    private Float confidence;       // 신뢰도 점수 (0.0 ~ 1.0)
    private String languageCode;    // 인식된 언어 코드 ("ko-KR")
}
