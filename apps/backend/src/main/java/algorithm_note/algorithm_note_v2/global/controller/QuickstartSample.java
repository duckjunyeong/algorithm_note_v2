package algorithm_note.algorithm_note_v2.global.controller;

import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class QuickstartSample {

  /** Demonstrates using the Speech API to transcribe an audio file. */
  public static void main(String... args) throws Exception {
    // Instantiates a client
    try (SpeechClient speechClient = SpeechClient.create()) {

      // The path to the audio file to transcribe
      String gcsUri = "gs://junyeong_buket/test.flac";
      log.info("테스트");
      // Builds the sync recognize request
      RecognitionConfig config =
          RecognitionConfig.newBuilder()
              .setEncoding(AudioEncoding.FLAC)
              .setSampleRateHertz(16000)
              .setLanguageCode("ko-kR")
              .build();
      RecognitionAudio audio = RecognitionAudio.newBuilder().setUri(gcsUri).build();

      // Performs speech recognition on the audio file
      RecognizeResponse response = speechClient.recognize(config, audio);
      List<SpeechRecognitionResult> results = response.getResultsList();

      for (SpeechRecognitionResult result : results) {
        // There can be several alternative transcripts for a given chunk of speech. Just use the
        // first (most likely) one here.
        SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
        log.info("Transcription: {}", alternative.getTranscript());
      }
    }
  }
}