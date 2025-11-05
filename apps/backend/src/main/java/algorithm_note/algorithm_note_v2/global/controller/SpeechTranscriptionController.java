package algorithm_note.algorithm_note_v2.global.controller;

import algorithm_note.algorithm_note_v2.global.dto.SpeechTranscriptionRequestDto;
import algorithm_note.algorithm_note_v2.global.dto.SpeechTranscriptionResponseDto;
import algorithm_note.algorithm_note_v2.global.service.SpeechTranscriptionService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/speech")
@RequiredArgsConstructor
public class SpeechTranscriptionController {

    private final SpeechTranscriptionService speechTranscriptionService;

    @PostMapping("/transcribe")
    public ResponseEntity<SpeechTranscriptionResponseDto> transcribeAudio(
            @Valid @RequestBody SpeechTranscriptionRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        log.info("Received STT transcription request from user: {}, gcsPath: {}",
                currentUser.getClerkId(),
                requestDto.getGcsPath());

        try {
            SpeechTranscriptionResponseDto response = speechTranscriptionService.transcribeAudio(
                    requestDto.getGcsPath()
            );

            log.info("Successfully transcribed audio for user: {}. Transcript: {}, Confidence: {}",
                    currentUser.getClerkId(),
                    response.getTranscript(),
                    response.getConfidence());

            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            log.error("Failed to transcribe audio for user: {}, gcsPath: {}",
                    currentUser.getClerkId(),
                    requestDto.getGcsPath(),
                    e);
            throw e;
        }
    }
}
