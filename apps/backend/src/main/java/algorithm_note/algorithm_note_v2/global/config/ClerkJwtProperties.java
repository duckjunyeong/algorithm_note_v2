package algorithm_note.algorithm_note_v2.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "clerk.jwt")
@Getter
@Setter
public class ClerkJwtProperties {

    private String instanceDomain;

    private String issuer;

    private String audience;

    private long jwksCacheExpirationSeconds = 3600;

    private long expirationLeewaySeconds = 0;

    public String getJwksUrl() {
        if (instanceDomain == null || instanceDomain.trim().isEmpty()) {
            throw new IllegalStateException("Clerk instance domain is not configured");
        }
        return String.format("https://%s/.well-known/jwks.json", instanceDomain.trim());
    }
}