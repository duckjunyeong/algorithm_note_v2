package algorithm_note.algorithm_note_v2.user.controller;

import algorithm_note.algorithm_note_v2.user.domain.User;
import algorithm_note.algorithm_note_v2.user.dto.UserRegisterRequestDto;
import algorithm_note.algorithm_note_v2.user.dto.UserResponseDto;
import algorithm_note.algorithm_note_v2.user.dto.UserUpdateRequestDto;
import algorithm_note.algorithm_note_v2.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Manually registers a new user (for admin/test purposes).
     * Note: Normal user registration is handled automatically via Clerk webhook at /webhooks/clerk
     *
     * @param requestDto The user registration request data
     * @return ResponseEntity with user creation result
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRegisterRequestDto requestDto) {
        log.info("Manually registering new user with Clerk ID: {}", requestDto.getClerkId());

        User createdUser = userService.registerUser(requestDto);
        UserResponseDto response = UserResponseDto.success(createdUser, "User registered successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{clerkUserId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable String clerkUserId,
            @RequestBody UserUpdateRequestDto requestDto) {

        log.info("Updating user with Clerk ID: {}", clerkUserId);

        User updatedUser = userService.updateUser(clerkUserId, requestDto);
        UserResponseDto response = UserResponseDto.success(updatedUser, "User updated successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{clerkUserId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable String clerkUserId) {
        log.info("Retrieving user with Clerk ID: {}", clerkUserId);

        User user = userService.getUserByClerkId(clerkUserId);
        UserResponseDto response = UserResponseDto.success(user, "User retrieved successfully");

        return ResponseEntity.ok(response);
    }
}