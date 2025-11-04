package algorithm_note.algorithm_note_v2.global.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class OriginLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        String method = request.getMethod();
        String requestUri = request.getRequestURI();

        if (origin != null) {
            log.info("Request received - Method: {}, URI: {}, Origin: {}", method, requestUri, origin);
        } else {
            log.info("Request received - Method: {}, URI: {}, Origin: [No Origin header]", method, requestUri);
        }

        filterChain.doFilter(request, response);
    }
}