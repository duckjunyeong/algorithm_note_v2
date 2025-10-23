package algorithm_note.algorithm_note_v2.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Root landing page
        registry.addViewController("/").setViewName("forward:/index.html");

        // Dashboard entry points
        registry.addViewController("/dashboard").setViewName("forward:/dashboard/index.html");
        registry.addViewController("/dashboard/").setViewName("forward:/dashboard/index.html");

        // Landing Page SPA routing (React Router)
        // Forward all non-API, non-static paths to index.html for client-side routing
        // Excludes: /api/**, /static/**, /dashboard/**, /assets/**, /index.html, and files with extensions
        registry.addViewController("/{path:(?!api|static|dashboard|assets|index\\.html)[^\\.]*}")
            .setViewName("forward:/index.html");

        // Dashboard SPA routing
        // Forward dashboard sub-routes to dashboard/index.html
        registry.addViewController("/dashboard/{path:(?!index\\.html)[^\\.]*}")
            .setViewName("forward:/dashboard/index.html");
    }
}
