package algorithm_note.algorithm_note_v2.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");

        registry.addViewController("/dashboard").setViewName("forward:/dashboard/index.html");
        registry.addViewController("/dashboard/").setViewName("forward:/dashboard/index.html");

        registry.addViewController("/{path:(?!api|static|dashboard|assets|index\\.html)[^\\.]*}")
            .setViewName("forward:/index.html");

        registry.addViewController("/dashboard/{path:(?!index\\.html)[^\\.]*}")
            .setViewName("forward:/dashboard/index.html");
    }
}
