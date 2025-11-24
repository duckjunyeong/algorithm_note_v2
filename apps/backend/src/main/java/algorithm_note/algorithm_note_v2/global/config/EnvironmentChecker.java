package algorithm_note.algorithm_note_v2.global.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 환경변수 및 프로퍼티 설정 상태를 진단하는 컴포넌트
 */
@Component
@Slf4j
public class EnvironmentChecker {

    private final Environment environment;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    public EnvironmentChecker(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void checkEnvironment() {
        log.info("========================================");
        log.info("🔍 ENVIRONMENT DIAGNOSTICS ON STARTUP");
        log.info("========================================");

        // 1. Active Profile 확인
        log.info("1. Active Spring Profile: {}", activeProfile);
        String[] profiles = environment.getActiveProfiles();
        log.info("   - All active profiles: {}", String.join(", ", profiles));

        // 2. GOOGLE_API_KEY 환경변수 확인 (Google Gemini SDK가 사용하는 표준 환경변수)
        String googleApiKey = System.getenv("GOOGLE_API_KEY");
        log.info("2. GOOGLE_API_KEY Environment Variable (used by Gemini SDK):");
        if (googleApiKey == null) {
            log.error("   ❌ NOT FOUND - Environment variable GOOGLE_API_KEY is not set!");
            log.error("   - This is REQUIRED for Gemini API calls");
            log.error("   - Add GOOGLE_API_KEY to docker-compose.prod.yml");
        } else {
            log.info("   ✅ FOUND");
            log.info("   - Length: {} characters", googleApiKey.length());
            log.info("   - Preview: {}****", googleApiKey.length() > 4 ? googleApiKey.substring(0, 4) : "TOO_SHORT");

            // API 키 형식 검증
            if (googleApiKey.length() < 20) {
                log.warn("   ⚠️  WARNING: API key seems too short (expected 39+ characters for Google API keys)");
            }
            if (!googleApiKey.startsWith("AIza")) {
                log.warn("   ⚠️  WARNING: Google Gemini API keys typically start with 'AIza'");
            }
        }

        // 3. AI_API_KEY 환경변수 확인 (레거시, 참고용)
        String aiApiKey = System.getenv("AI_API_KEY");
        log.info("3. AI_API_KEY Environment Variable (legacy):");
        if (aiApiKey == null) {
            log.info("   - Not set (OK, GOOGLE_API_KEY is used instead)");
        } else {
            log.info("   ✅ Found");
            log.info("   - Length: {} characters", aiApiKey.length());

            // GOOGLE_API_KEY와 비교
            if (googleApiKey != null && !googleApiKey.equals(aiApiKey)) {
                log.warn("   ⚠️  WARNING: AI_API_KEY and GOOGLE_API_KEY have different values!");
                log.warn("   - Google SDK will use GOOGLE_API_KEY, not AI_API_KEY");
            }
        }

        // 4. 기타 주요 환경변수 확인
        log.info("4. Other Environment Variables:");
        logEnvVar("SPRING_PROFILES_ACTIVE", System.getenv("SPRING_PROFILES_ACTIVE"));
        logEnvVar("SPRING_DATASOURCE_URL", System.getenv("SPRING_DATASOURCE_URL"));
        logEnvVar("REDIS_HOST", System.getenv("REDIS_HOST"));

        // 5. 최종 상태 요약
        log.info("========================================");
        boolean isHealthy = googleApiKey != null && googleApiKey.length() > 20;

        if (isHealthy) {
            log.info("✅ ENVIRONMENT CHECK PASSED");
            log.info("   Gemini API Key (GOOGLE_API_KEY) is properly configured and ready to use");
        } else {
            log.error("❌ ENVIRONMENT CHECK FAILED");
            log.error("   GOOGLE_API_KEY is not set or invalid - Gemini API calls will fail");
            log.error("   Please check the diagnostics above and fix the configuration");
        }
        log.info("========================================");
    }

    private void logEnvVar(String name, String value) {
        if (value == null) {
            log.info("   - {}: NOT SET", name);
        } else {
            // 민감한 정보는 일부만 표시
            if (name.contains("PASSWORD") || name.contains("KEY")) {
                log.info("   - {}: {}****", name, value.length() > 4 ? value.substring(0, 4) : "***");
            } else {
                log.info("   - {}: {}", name, value);
            }
        }
    }
}
