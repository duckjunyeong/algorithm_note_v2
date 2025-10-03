package algorithm_note.algorithm_note_v2.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Spring Scheduler 설정
 *
 * @Scheduled 어노테이션을 사용한 스케줄링 작업을 활성화합니다.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Spring Scheduler 활성화
}
