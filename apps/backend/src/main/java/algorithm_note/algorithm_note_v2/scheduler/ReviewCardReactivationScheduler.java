package algorithm_note.algorithm_note_v2.scheduler;

import algorithm_note.algorithm_note_v2.scheduler.service.ReviewCardReactivationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 복습 카드 자동 재활성화 스케줄러
 *
 * 설정된 주기에 따라 비활성화된 복습 카드를 자동으로 재활성화합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewCardReactivationScheduler {

    private final ReviewCardReactivationService reactivationService;

    /**
     * 복습 카드 재활성화 작업을 주기적으로 실행합니다.
     *
     * 실행 주기:
     * - 개발 환경: 매 10초 (환경변수로 설정)
     * - 배포 환경: 매일 자정 (환경변수로 설정)
     *
     * Cron 표현식은 application.properties의 ${revalidation.schedule}에서 주입됩니다.
     */
    @Scheduled(cron = "${revalidation.schedule:0 0 * * * *}")
    public void scheduleReactivation() {
        log.info("=== Review Card Reactivation Scheduler Started ===");

        try {
            reactivationService.reactivateExpiredCards();
            log.info("=== Review Card Reactivation Scheduler Completed Successfully ===");
        } catch (Exception e) {
            log.error("=== Review Card Reactivation Scheduler Failed ===", e);
        }
    }
}
