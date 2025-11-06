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

    public SignedUrlInfo generateSignedUrl(String userId, String fileName, String contentType)
            throws IOException, StorageException {

        log.info("Generating signed URL for user: {}, fileName: {}, contentType: {}",
                userId, fileName, contentType);

        String objectName = generateUniqueObjectName(userId, fileName);
        log.debug("Generated object name: {}", objectName);

        Storage storage = initializeStorage();

        BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(BUCKET_NAME, objectName)).build();

        Map<String, String> extensionHeaders = new HashMap<>();
        extensionHeaders.put("Content-Type", contentType);

        URL signedUrl = storage.signUrl(
                blobInfo,
                EXPIRATION_MINUTES,
                TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
                Storage.SignUrlOption.withExtHeaders(extensionHeaders),
                Storage.SignUrlOption.withV4Signature()
        );

        String gcsPath = String.format("gs://%s/%s", BUCKET_NAME, objectName);
        String fileUrl = String.format("https://storage.googleapis.com/%s/%s", BUCKET_NAME, objectName);

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

    private String extractExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".ogg"; // 기본 확장자
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

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
