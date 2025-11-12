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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
        return !path.startsWith("/api/");
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

        // Extract roles from public_metadata
        List<GrantedAuthority> authorities = extractAuthoritiesFromClaims(jwtClaims);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Successfully authenticated user with Clerk ID: {} and roles: {}",
                  user.getClerkId(), authorities);
    }


    private List<GrantedAuthority> extractAuthoritiesFromClaims(Map<String, Object> jwtClaims) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        Object publicMetadata = jwtClaims.get("public_metadata");
        if (publicMetadata instanceof List) {
            List<?> roles = (List<?>) publicMetadata;
            for (Object role : roles) {
                if (role instanceof String) {
                    // Spring Security convention: prefix with "ROLE_"
                    String roleStr = ((String) role).toUpperCase();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + roleStr));
                }
            }
        }

        if (authorities.isEmpty()) {
            log.warn("No roles found in public_metadata, assigning default ROLE_USER");
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return authorities;
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