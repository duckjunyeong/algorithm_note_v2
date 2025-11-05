package algorithm_note.algorithm_note_v2.global.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignedUrlResponseDto {

    private String signedUrl;      // 업로드용 Signed URL (15분 만료)
    private String objectName;      // GCS 객체명
    private String gcsPath;         // gs://bucket/path (STT 분석용)
    private String fileUrl;         // https://storage.googleapis.com/... (다운로드용)
    private String expiresAt;       // Signed URL 만료 시간
}
