package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.config.WebhookProperties;
import com.svix.Webhook;
import com.svix.exceptions.WebhookVerificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.http.HttpHeaders;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClerkWebhookVerificationService {

  private final WebhookProperties webhookProperties;

  public void verify(String payload, Map<String, String> headers) throws WebhookVerificationException {
    String rawSecret = webhookProperties.getSecret();
    String cleanedSecret = rawSecret.startsWith("whsec_")
        ? rawSecret.substring("whsec_".length())
        : rawSecret;

    Webhook webhook = new Webhook(cleanedSecret);
    Map<String, List<String>> headerMap = new HashMap<>();
    headers.forEach((key, value) ->
        headerMap.put(key, Collections.singletonList(value))
    );

    HttpHeaders httpHeaders = HttpHeaders.of(headerMap, (k, v) -> true);
    webhook.verify(payload, httpHeaders);
  }
}