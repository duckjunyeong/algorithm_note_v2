package algorithm_note.algorithm_note_v2.scheduler;

import algorithm_note.algorithm_note_v2.scheduler.service.ReviewCardReactivationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewCardReactivationScheduler {

    private final ReviewCardReactivationService reactivationService;

    @Scheduled(cron = "${revalidation.schedule}")
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
