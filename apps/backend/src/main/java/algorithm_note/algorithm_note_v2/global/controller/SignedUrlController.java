package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.global.dto.SignedUrlRequestDto;
import algorithm_note.algorithm_note_v2.global.dto.SignedUrlResponseDto;
import algorithm_note.algorithm_note_v2.global.service.SignedUrlService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import com.google.cloud.storage.StorageException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/signed-url")
@RequiredArgsConstructor
public class SignedUrlController {

    private final SignedUrlService signedUrlService;

    @PostMapping
    public ResponseEntity<SignedUrlResponseDto> generateSignedUrl(
            @Valid @RequestBody SignedUrlRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        log.info("Received signed URL request from user: {}, fileName: {}, contentType: {}",
                currentUser.getClerkId(),
                requestDto.getFileName(),
                requestDto.getContentType());

        try {
            SignedUrlService.SignedUrlInfo signedUrlInfo = signedUrlService.generateSignedUrl(
                    currentUser.getClerkId(),
                    requestDto.getFileName(),
                    requestDto.getContentType()
            );

            SignedUrlResponseDto response = SignedUrlResponseDto.builder()
                    .signedUrl(signedUrlInfo.getSignedUrl())
                    .objectName(signedUrlInfo.getObjectName())
                    .gcsPath(signedUrlInfo.getGcsPath())
                    .fileUrl(signedUrlInfo.getFileUrl())
                    .expiresAt(signedUrlInfo.getExpiresAt())
                    .build();

            log.info("Successfully generated signed URL for user: {}, GCS path: {}",
                    currentUser.getClerkId(),
                    signedUrlInfo.getGcsPath());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to load credentials file for user: {}", currentUser.getClerkId(), e);
            throw new IllegalStateException("자격 증명 파일을 로드하는 데 실패했습니다: " + e.getMessage(), e);
        } catch (StorageException e) {
            log.error("Failed to generate signed URL for user: {}", currentUser.getClerkId(), e);
            throw new IllegalStateException("Signed URL 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
