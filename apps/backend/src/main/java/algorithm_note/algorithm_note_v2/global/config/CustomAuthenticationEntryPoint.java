package algorithm_note.algorithm_note_v2.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final String SIGN_IN_PATH = "/sign-in";
    private static final String API_PREFIX = "/api/";
    private static final String AJAX_HEADER = "X-Requested-With";
    private static final String AJAX_HEADER_VALUE = "XMLHttpRequest";

    @Value("${app.frontend.landing-url}")
    private String landingPage;

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        String requestUri = request.getRequestURI();
        log.debug("Unauthorized access attempt to: {}", requestUri);

        if (isApiRequest(request)) {
            handleApiRequest(response, authException);
        } else {
            handlePageRequest(request, response);
        }
    }

    private boolean isApiRequest(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String acceptHeader = request.getHeader("Accept");
        String ajaxHeader = request.getHeader(AJAX_HEADER);

        if (requestUri.startsWith(API_PREFIX)) {
            return true;
        }

        if (AJAX_HEADER_VALUE.equalsIgnoreCase(ajaxHeader)) {
            return true;
        }

        if (acceptHeader != null && acceptHeader.contains(MediaType.APPLICATION_JSON_VALUE)) {
            return true;
        }

        return false;
    }

    private void handleApiRequest(HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorResponse = Map.of(
                "error", "Unauthorized",
                "message", authException.getMessage() != null ? authException.getMessage() : "Authentication required",
                "status", HttpStatus.UNAUTHORIZED.value()
        );

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        log.debug("Returned JSON error response for API request");
    }

    private void handlePageRequest(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String targetUrl = request.getRequestURI();
        String redirectUrl = landingPage + SIGN_IN_PATH;

        log.debug("Redirecting to {} (original request: {})", redirectUrl, targetUrl);

        response.sendRedirect(redirectUrl);
    }
}
