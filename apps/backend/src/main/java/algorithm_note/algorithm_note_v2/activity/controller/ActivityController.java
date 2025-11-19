package algorithm_note.algorithm_note_v2.activity.controller;

import algorithm_note.algorithm_note_v2.activity.dto.ActivityResponseDto;
import algorithm_note.algorithm_note_v2.activity.dto.RecordCompletionRequestDto;
import algorithm_note.algorithm_note_v2.activity.dto.RecordCompletionResponseDto;
import algorithm_note.algorithm_note_v2.activity.dto.StreakInfoResponseDto;
import algorithm_note.algorithm_note_v2.activity.service.ActivityService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/completion")
    public ResponseEntity<RecordCompletionResponseDto> recordCompletion(
            @Valid @RequestBody RecordCompletionRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) {

        log.info("Recording completion for user: {}, date: {}", currentUser.getId(), requestDto.getActivityDate());

        try {
            ActivityResponseDto activityRecord = activityService.recordCompletion(requestDto, currentUser);

            log.info("Successfully recorded completion with activity ID: {}", activityRecord.getActivityId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(RecordCompletionResponseDto.success(activityRecord, "활동이 성공적으로 기록되었습니다."));

        } catch (Exception e) {
            log.error("Failed to record completion for user: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(RecordCompletionResponseDto.failure("활동 기록에 실패했습니다."));
        }
    }

    @GetMapping("/streak")
    public ResponseEntity<StreakInfoResponseDto> getStreakInfo(
            @AuthenticationPrincipal User currentUser) {

        log.info("Fetching streak info for user: {}", currentUser.getId());

        StreakInfoResponseDto streakInfo = activityService.getStreakInfo(currentUser);

        log.info("Successfully fetched streak info for user: {}, current streak: {}",
                currentUser.getId(), streakInfo.getCurrentStreak());

        return ResponseEntity.ok(streakInfo);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ActivityResponseDto>> getActivityHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User currentUser) {

        log.info("Fetching activity history for user: {} from {} to {}",
                currentUser.getId(), startDate, endDate);

        List<ActivityResponseDto> activities = activityService.getActivityHistory(currentUser, startDate, endDate);

        log.info("Found {} activities for user: {}", activities.size(), currentUser.getId());

        return ResponseEntity.ok(activities);
    }
}
