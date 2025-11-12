package algorithm_note.algorithm_note_v2.scheduler.service;

import algorithm_note.algorithm_note_v2.reviewcard.domain.ReviewCard;
import algorithm_note.algorithm_note_v2.reviewcard.repository.ReviewCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewCardReactivationService {

    private final ReviewCardRepository reviewCardRepository;

    @Transactional
    public void reactivateExpiredCards() {
        log.info("Starting review card reactivation task");

        try {
            // 1. 비활성화된 모든 카드 조회
            List<ReviewCard> inactiveCards = reviewCardRepository.findAllByIsActive(false);

            if (inactiveCards.isEmpty()) {
                log.info("No inactive cards found. Skipping reactivation.");
                return;
            }

            log.info("Found {} inactive cards. Checking for reactivation candidates...", inactiveCards.size());

            LocalDateTime now = LocalDateTime.now();
            int reactivatedCount = 0;

            // 2. 각 카드의 경과 시간 확인 및 재활성화
            for (ReviewCard card : inactiveCards) {
                LocalDateTime updatedAt = card.getUpdatedAt();
                Integer reviewCycle = card.getReviewCycle();

                // reviewCycle은 일(day) 단위
                long daysSinceUpdate = ChronoUnit.DAYS.between(updatedAt, now);

                if (daysSinceUpdate >= reviewCycle) {
                    log.debug("Reactivating card ID: {} (days elapsed: {}, cycle: {})",
                            card.getReviewCardId(), daysSinceUpdate, reviewCycle);

                    card.updateStatus(true);
                    reviewCardRepository.save(card);
                    reactivatedCount++;
                }
            }

            log.info("Review card reactivation completed. Reactivated {} card(s).", reactivatedCount);

        } catch (Exception e) {
            log.error("Error occurred during review card reactivation", e);
            throw e;
        }
    }
}
