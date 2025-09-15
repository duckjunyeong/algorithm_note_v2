package algorithm_note.algorithm_note_v2.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for Clerk JWT verification.
 */
@Component
@ConfigurationProperties(prefix = "clerk.jwt")
@Getter
@Setter
public class ClerkJwtProperties {

    /**
     * Clerk instance domain for JWKS URL construction.
     */
    private String instanceDomain;

    /**
     * Expected issuer of JWT tokens.
     */
    private String issuer;

    /**
     * Expected audience of JWT tokens.
     */
    private String audience;

    /**
     * JWKS cache expiration time in seconds.
     */
    private long jwksCacheExpirationSeconds = 3600;

    /**
     * Constructs the JWKS URL from the instance domain.
     *
     * @return The JWKS endpoint URL
     */
    public String getJwksUrl() {
        if (instanceDomain == null || instanceDomain.trim().isEmpty()) {
            throw new IllegalStateException("Clerk instance domain is not configured");
        }
        return String.format("https://%s/.well-known/jwks.json", instanceDomain.trim());
    }
}