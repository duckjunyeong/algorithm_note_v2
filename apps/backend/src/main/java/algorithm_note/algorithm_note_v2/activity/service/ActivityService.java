package algorithm_note.algorithm_note_v2.activity.service;

import algorithm_note.algorithm_note_v2.activity.domain.Activity;
import algorithm_note.algorithm_note_v2.activity.dto.ActivityResponseDto;
import algorithm_note.algorithm_note_v2.activity.dto.RecordCompletionRequestDto;
import algorithm_note.algorithm_note_v2.activity.dto.StreakInfoResponseDto;
import algorithm_note.algorithm_note_v2.activity.repository.ActivityRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActivityService {

    private final ActivityRepository activityRepository;

    @Transactional
    public ActivityResponseDto recordCompletion(RecordCompletionRequestDto requestDto, User user) {
        log.info("Recording completion for user: {}, date: {}", user.getId(), requestDto.getActivityDate());

        try {
            Optional<Activity> existingActivity = activityRepository.findByUserAndActivityDate(
                    user, requestDto.getActivityDate()
            );

            Activity activity;
            if (existingActivity.isPresent()) {
                activity = existingActivity.get();
                log.info("Updating existing activity record for date: {}", requestDto.getActivityDate());

                if (requestDto.getReviewCardsCompleted() != null && requestDto.getReviewCardsCompleted() > 0) {
                    activity.incrementReviewCardsCompleted();
                }
                if (requestDto.getQuestionsAnswered() != null && requestDto.getQuestionsAnswered() > 0) {
                    activity.addQuestionsAnswered(requestDto.getQuestionsAnswered());
                }
                if (requestDto.getStudyTimeMinutes() != null && requestDto.getStudyTimeMinutes() > 0) {
                    activity.addStudyTime(requestDto.getStudyTimeMinutes());
                }
            } else {
                log.info("Creating new activity record for date: {}", requestDto.getActivityDate());

                activity = Activity.builder()
                        .user(user)
                        .activityDate(requestDto.getActivityDate())
                        .reviewCardsCompleted(requestDto.getReviewCardsCompleted() != null ? requestDto.getReviewCardsCompleted() : 1)
                        .questionsAnswered(requestDto.getQuestionsAnswered() != null ? requestDto.getQuestionsAnswered() : 0)
                        .studyTimeMinutes(requestDto.getStudyTimeMinutes() != null ? requestDto.getStudyTimeMinutes() : 0)
                        .build();
            }

            Activity savedActivity = activityRepository.save(activity);
            log.info("Successfully saved activity record with ID: {}", savedActivity.getActivityId());

            return ActivityResponseDto.from(savedActivity);

        } catch (Exception e) {
            log.error("Failed to record completion for user: {}", user.getId(), e);
            throw new RuntimeException("활동 기록 저장에 실패했습니다.", e);
        }
    }

    public StreakInfoResponseDto getStreakInfo(User user) {
        log.info("Fetching streak info for user: {}", user.getId());

        LocalDate today = LocalDate.now();
        List<Activity> activities = activityRepository.findAllByUserOrderByActivityDateDesc(user);

        if (activities.isEmpty()) {
            log.info("No activities found for user: {}", user.getId());
            return StreakInfoResponseDto.builder()
                    .currentStreak(0)
                    .longestStreak(0)
                    .lastCompletedDate(null)
                    .todayCompleted(false)
                    .build();
        }

        LocalDate lastCompletedDate = activities.get(0).getActivityDate();
        boolean todayCompleted = lastCompletedDate.equals(today);

        int currentStreak = calculateCurrentStreak(activities, today);
        int longestStreak = calculateLongestStreak(activities);

        log.info("Streak info for user {}: current={}, longest={}, lastCompleted={}, todayCompleted={}",
                user.getId(), currentStreak, longestStreak, lastCompletedDate, todayCompleted);

        return StreakInfoResponseDto.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .lastCompletedDate(lastCompletedDate)
                .todayCompleted(todayCompleted)
                .build();
    }

    private int calculateCurrentStreak(List<Activity> activities, LocalDate today) {
        if (activities.isEmpty()) {
            return 0;
        }

        LocalDate lastActivity = activities.get(0).getActivityDate();
        long daysSinceLastActivity = ChronoUnit.DAYS.between(lastActivity, today);

        if (daysSinceLastActivity > 1) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = lastActivity;

        for (Activity activity : activities) {
            if (activity.getActivityDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (activity.getActivityDate().isBefore(expectedDate)) {
                break;
            }
        }

        return streak;
    }

    private int calculateLongestStreak(List<Activity> activities) {
        if (activities.isEmpty()) {
            return 0;
        }

        int longestStreak = 1;
        int currentStreak = 1;

        for (int i = 0; i < activities.size() - 1; i++) {
            LocalDate currentDate = activities.get(i).getActivityDate();
            LocalDate nextDate = activities.get(i + 1).getActivityDate();

            long daysBetween = ChronoUnit.DAYS.between(nextDate, currentDate);

            if (daysBetween == 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return longestStreak;
    }

    public List<ActivityResponseDto> getActivityHistory(User user, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching activity history for user: {} from {} to {}", user.getId(), startDate, endDate);

        List<Activity> activities = activityRepository.findByUserAndActivityDateBetween(user, startDate, endDate);

        log.info("Found {} activities for user: {}", activities.size(), user.getId());

        return activities.stream()
                .map(ActivityResponseDto::from)
                .toList();
    }
}
