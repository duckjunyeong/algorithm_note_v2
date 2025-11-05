package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.dto.SpeechTranscriptionResponseDto;
import com.google.cloud.speech.v1.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpeechTranscriptionService {

    public SpeechTranscriptionResponseDto transcribeAudio(String gcsUri) {
        log.info("Starting STT transcription for GCS URI: {}", gcsUri);

        try (SpeechClient speechClient = SpeechClient.create()) {

            RecognitionConfig.AudioEncoding encoding = detectEncodingFromExtension(gcsUri);
            log.debug("Detected audio encoding: {} from URI: {}", encoding, gcsUri);

            RecognitionConfig config =
                    RecognitionConfig.newBuilder()
                            .setEncoding(encoding)
                            //.setSampleRateHertz(16000)
                            .setLanguageCode("ko-KR")
                            .build();

            RecognitionAudio audio = RecognitionAudio.newBuilder().setUri(gcsUri).build();

            RecognizeResponse response = speechClient.recognize(config, audio);
            List<SpeechRecognitionResult> results = response.getResultsList();

            if (results.isEmpty()) {
                log.warn("No transcription results found for GCS URI: {}", gcsUri);
                return SpeechTranscriptionResponseDto.builder()
                        .transcript("")
                        .confidence(0.0f)
                        .languageCode("ko-KR")
                        .build();
            }

            SpeechRecognitionResult result = results.get(0);
            SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);

            String transcript = alternative.getTranscript();
            float confidence = alternative.getConfidence();

            log.info("Transcription completed successfully. Transcript: {}, Confidence: {}",
                    transcript, confidence);

            return SpeechTranscriptionResponseDto.builder()
                    .transcript(transcript)
                    .confidence(confidence)
                    .languageCode("ko-KR")
                    .build();

        } catch (IOException e) {
            log.error("Failed to initialize Speech client for GCS URI: {}", gcsUri, e);
            throw new IllegalStateException("STT 클라이언트 초기화에 실패했습니다: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to transcribe audio for GCS URI: {}", gcsUri, e);
            throw new IllegalStateException("음성 인식에 실패했습니다: " + e.getMessage(), e);
        }
    }

    private RecognitionConfig.AudioEncoding detectEncodingFromExtension(String gcsUri) {
        String lowerCaseUri = gcsUri.toLowerCase();

        if (lowerCaseUri.endsWith(".ogg")) {
            return RecognitionConfig.AudioEncoding.OGG_OPUS;
        } else if (lowerCaseUri.endsWith(".webm")) {
            return RecognitionConfig.AudioEncoding.WEBM_OPUS;
        } else if (lowerCaseUri.endsWith(".flac")) {
            return RecognitionConfig.AudioEncoding.FLAC;
        } else {
            log.warn("Unknown audio format for URI: {}. Defaulting to OGG_OPUS", gcsUri);
            return RecognitionConfig.AudioEncoding.OGG_OPUS;
        }
    }
}
