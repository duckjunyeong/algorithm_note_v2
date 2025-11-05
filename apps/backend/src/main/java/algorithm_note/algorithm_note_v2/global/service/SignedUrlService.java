package algorithm_note.algorithm_note_v2.global.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignedUrlService {

    private static final String PROJECT_ID = "double-genius-469802-r0";
    private static final String BUCKET_NAME = "junyeong_buket";
    private static final String VOICE_RECORDINGS_PATH = "voice-recordings/";
    private static final int EXPIRATION_MINUTES = 15;

    /**
     * Signed URL을 생성하고 GCS 경로 정보를 함께 반환합니다.
     *
     * @param userId 사용자 ID
     * @param fileName 원본 파일명
     * @param contentType MIME 타입 (예: audio/ogg;codecs=opus)
     * @return Signed URL과 GCS 경로 정보
     * @throws IOException 자격 증명 파일 로드 실패 시
     * @throws StorageException GCS 접근 실패 시
     */
    public SignedUrlInfo generateSignedUrl(String userId, String fileName, String contentType)
            throws IOException, StorageException {

        log.info("Generating signed URL for user: {}, fileName: {}, contentType: {}",
                userId, fileName, contentType);

        // 1. 고유한 객체명 생성 (userId-timestamp-uuid.extension)
        String objectName = generateUniqueObjectName(userId, fileName);
        log.debug("Generated object name: {}", objectName);

        // 2. Google Cloud Storage 클라이언트 초기화
        Storage storage = initializeStorage();

        // 3. BlobInfo 생성
        BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(BUCKET_NAME, objectName)).build();

        // 4. Content-Type 헤더 설정
        Map<String, String> extensionHeaders = new HashMap<>();
        extensionHeaders.put("Content-Type", contentType);

        // 5. Signed URL 생성 (PUT 메서드, 15분 만료)
        URL signedUrl = storage.signUrl(
                blobInfo,
                EXPIRATION_MINUTES,
                TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
                Storage.SignUrlOption.withExtHeaders(extensionHeaders),
                Storage.SignUrlOption.withV4Signature()
        );

        // 6. GCS 경로 생성
        String gcsPath = String.format("gs://%s/%s", BUCKET_NAME, objectName);
        String fileUrl = String.format("https://storage.googleapis.com/%s/%s", BUCKET_NAME, objectName);

        // 7. 만료 시간 계산
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
        String expiresAtStr = expiresAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        log.info("Successfully generated signed URL. GCS path: {}", gcsPath);
        log.debug("Signed URL: {}", signedUrl.toString());
        log.debug("File URL: {}", fileUrl);
        log.debug("Expires at: {}", expiresAtStr);

        return SignedUrlInfo.builder()
                .signedUrl(signedUrl.toString())
                .objectName(objectName)
                .gcsPath(gcsPath)
                .fileUrl(fileUrl)
                .expiresAt(expiresAtStr)
                .build();
    }

    /**
     * Google Cloud Storage 클라이언트를 초기화합니다.
     */
    private Storage initializeStorage() throws IOException {
        InputStream credentialsStream = SignedUrlService.class
                .getClassLoader()
                .getResourceAsStream("stt.json");

        if (credentialsStream == null) {
            log.error("stt.json file not found in resources");
            throw new IllegalStateException("stt.json 파일을 찾을 수 없습니다. src/main/resources/stt.json 파일이 존재하는지 확인하세요.");
        }

        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);

        return StorageOptions.newBuilder()
                .setProjectId(PROJECT_ID)
                .setCredentials(credentials)
                .build()
                .getService();
    }

    /**
     * 고유한 객체명을 생성합니다.
     * 형식: voice-recordings/{userId}-{timestamp}-{uuid}.{extension}
     */
    private String generateUniqueObjectName(String userId, String fileName) {
        long timestamp = System.currentTimeMillis();
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String extension = extractExtension(fileName);

        return String.format("%s%s-%d-%s%s",
                VOICE_RECORDINGS_PATH,
                userId,
                timestamp,
                uuid,
                extension);
    }

    /**
     * 파일명에서 확장자를 추출합니다.
     */
    private String extractExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".ogg"; // 기본 확장자
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    /**
     * Signed URL 정보를 담는 내부 클래스
     */
    @lombok.Getter
    @lombok.Builder
    public static class SignedUrlInfo {
        private String signedUrl;
        private String objectName;
        private String gcsPath;
        private String fileUrl;
        private String expiresAt;
    }
}
