package algorithm_note.algorithm_note_v2.global.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "clerk.webhook")
@Getter
public class WebhookProperties {

    private String secret;

    private String apiUrl = "https://api.clerk.dev/v1";

    private String apiSecret;

    private long maxTimestampDiff = 300;

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public void setApiSecret(String apiSecret) {
        this.apiSecret = apiSecret;
    }

    public void setMaxTimestampDiff(long maxTimestampDiff) {
        this.maxTimestampDiff = maxTimestampDiff;
    }
}