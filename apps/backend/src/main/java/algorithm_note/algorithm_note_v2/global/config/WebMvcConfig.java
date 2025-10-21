package algorithm_note.algorithm_note_v2.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Landing Page: Root path redirects to index.html
        registry.addViewController("/").setViewName("forward:/index.html");

        // Dashboard: /dashboard/* redirects to /dashboard/index.html
        registry.addViewController("/dashboard").setViewName("forward:/dashboard/index.html");
        registry.addViewController("/dashboard/").setViewName("forward:/dashboard/index.html");

        // SPA routing support - forward all non-API routes to index.html
        registry.addViewController("/{path:(?!api|static|dashboard).*}").setViewName("forward:/index.html");
        registry.addViewController("/dashboard/{path:[^\\.]*}").setViewName("forward:/dashboard/index.html");
    }
}
