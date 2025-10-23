package algorithm_note.algorithm_note_v2.global.filter;

import algorithm_note.algorithm_note_v2.global.exception.JwtVerificationException;
import algorithm_note.algorithm_note_v2.global.service.JwtVerificationService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import algorithm_note.algorithm_note_v2.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

/**
 * Custom filter for Clerk JWT authentication.
 * Verifies JWT tokens and sets User entity as the authenticated principal.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ClerkJwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtVerificationService jwtVerificationService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = extractTokenFromRequest(request);
            if (token != null) {
                authenticateRequest(token);
            }
        } catch (Exception e) {
            log.warn("JWT authentication failed: {}", e.getMessage());
            handleAuthenticationFailure(response, e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        return path.equals("/") ||
               path.equals("/index.html") ||
               path.equals("/sign-in") ||
               path.equals(("/sign-up")) ||
               path.startsWith("/static/") ||
               path.startsWith("/css/") ||
               path.startsWith("/js/") ||
               path.startsWith("/assets/") ||
               path.startsWith("/images/") ||
               //path.startsWith("/dashboard/") ||
               path.startsWith("/webhooks/") ||
               path.startsWith("/public/") ||
               path.startsWith("/actuator/") ||
               path.endsWith(".ico") ||
               path.endsWith(".svg") ||
               path.endsWith(".json");
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length()).trim();
        }
        return null;
    }

    private void authenticateRequest(String token) {
        Map<String, Object> jwtClaims = jwtVerificationService.verifyToken(token);
        User user = userService.findOrCreateUser(jwtClaims);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Successfully authenticated user with Clerk ID: {}", user.getClerkId());
    }

    private void handleAuthenticationFailure(HttpServletResponse response, String message)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorResponse = Map.of(
                "error", "Authentication failed",
                "message", message,
                "status", HttpStatus.UNAUTHORIZED.value()
        );

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}