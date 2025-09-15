package algorithm_note.algorithm_note_v2.global.service;

import algorithm_note.algorithm_note_v2.global.config.ClerkJwtProperties;
import algorithm_note.algorithm_note_v2.global.exception.JwtVerificationException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for verifying Clerk JWT tokens using JWKS.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtVerificationService {

    private final ClerkJwtProperties clerkJwtProperties;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private volatile Instant lastKeyRefresh = Instant.MIN;

    /**
     * Verifies a JWT token and extracts claims.
     *
     * @param token The JWT token to verify
     * @return Map of claims if verification succeeds
     * @throws JwtVerificationException if verification fails
     */
    public Map<String, Object> verifyToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new JwtVerificationException("Invalid JWT format");
            }

            // token을 검증하려면 공개키를 이용해서 유효한 것인지를 판단해야하는 것 아닌가?
            Map<String, Object> header = parseJwtPart(parts[0]);
            Map<String, Object> payload = parseJwtPart(parts[1]);

            String keyId = (String) header.get("kid");
            if (keyId == null) {
                throw new JwtVerificationException("Missing key ID in JWT header");
            }

            PublicKey publicKey = getPublicKey(keyId);
            if (!verifySignature(token, publicKey)) {
                throw new JwtVerificationException("Invalid JWT signature");
            }

            validateTokenClaims(payload);
            return payload;

        } catch (Exception e) {
            if (e instanceof JwtVerificationException) {
                throw e;
            }
            throw new JwtVerificationException("JWT verification failed", e);
        }
    }

    private Map<String, Object> parseJwtPart(String part) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(part);
            return objectMapper.readValue(decoded, Map.class);
        } catch (Exception e) {
            throw new JwtVerificationException("Failed to parse JWT part", e);
        }
    }

    private PublicKey getPublicKey(String keyId) {
        if (shouldRefreshKeys()) {
            refreshKeys();
        }

        PublicKey publicKey = keyCache.get(keyId);
        if (publicKey == null) {
            refreshKeys();
            publicKey = keyCache.get(keyId);
            if (publicKey == null) {
                throw new JwtVerificationException("Public key not found for key ID: " + keyId);
            }
        }

        return publicKey;
    }

    private boolean shouldRefreshKeys() {
        return Duration.between(lastKeyRefresh, Instant.now()).getSeconds()
               > clerkJwtProperties.getJwksCacheExpirationSeconds();
    }

    private void refreshKeys() {
        try {
            String jwksResponse = webClient.get()
                    .uri(clerkJwtProperties.getJwksUrl())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jwks = objectMapper.readTree(jwksResponse);
            JsonNode keys = jwks.get("keys");

            keyCache.clear();

            for (JsonNode key : keys) {
                String keyId = key.get("kid").asText();
                String modulus = key.get("n").asText();
                String exponent = key.get("e").asText();

                PublicKey publicKey = createRSAPublicKey(modulus, exponent);
                keyCache.put(keyId, publicKey);
            }

            lastKeyRefresh = Instant.now();
            log.info("Refreshed {} JWT keys from JWKS", keyCache.size());

        } catch (Exception e) {
            throw new JwtVerificationException("Failed to refresh JWKS", e);
        }
    }

    private PublicKey createRSAPublicKey(String modulusBase64, String exponentBase64) {
        try {
            byte[] modulusBytes = Base64.getUrlDecoder().decode(modulusBase64);
            byte[] exponentBytes = Base64.getUrlDecoder().decode(exponentBase64);

            BigInteger modulus = new BigInteger(1, modulusBytes);
            BigInteger exponent = new BigInteger(1, exponentBytes);

            RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
            KeyFactory factory = KeyFactory.getInstance("RSA");
            return factory.generatePublic(spec);

        } catch (Exception e) {
            throw new JwtVerificationException("Failed to create RSA public key", e);
        }
    }

    private boolean verifySignature(String token, PublicKey publicKey) {
        try {
            String[] parts = token.split("\\.");
            String signedData = parts[0] + "." + parts[1];
            byte[] signature = Base64.getUrlDecoder().decode(parts[2]);

            java.security.Signature sig = java.security.Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(signedData.getBytes());

            return sig.verify(signature);

        } catch (Exception e) {
            log.error("Error verifying signature", e);
            return false;
        }
    }

    private void validateTokenClaims(Map<String, Object> payload) {
        Object exp = payload.get("exp");
        if (exp instanceof Number) {
            long expiration = ((Number) exp).longValue();
            if (Instant.now().getEpochSecond() >= expiration) {
                throw new JwtVerificationException("JWT token has expired");
            }
        }

        String issuer = (String) payload.get("iss");
        if (clerkJwtProperties.getIssuer() != null && !clerkJwtProperties.getIssuer().equals(issuer)) {
            throw new JwtVerificationException("Invalid issuer: " + issuer);
        }

        String audience = (String) payload.get("aud");
        if (clerkJwtProperties.getAudience() != null && !clerkJwtProperties.getAudience().equals(audience)) {
            throw new JwtVerificationException("Invalid audience: " + audience);
        }
    }
}