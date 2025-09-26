package algorithm_note.algorithm_note_v2.user.service;

import algorithm_note.algorithm_note_v2.user.domain.User;
import algorithm_note.algorithm_note_v2.user.dto.UserRegisterRequestDto;
import algorithm_note.algorithm_note_v2.user.dto.UserUpdateRequestDto;
import algorithm_note.algorithm_note_v2.user.exception.UserNotFoundException;
import algorithm_note.algorithm_note_v2.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Service for managing User entities with Just-In-Time provisioning.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User findOrCreateUser(Map<String, Object> jwtClaims) {
        String clerkId = extractClerkId(jwtClaims);

        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found with Clerk ID: " + clerkId +
                    ". Please ensure the user is registered through the application."));
    }


    private String extractClerkId(Map<String, Object> jwtClaims) {
        String clerkId = (String) jwtClaims.get("sub");
        if (clerkId == null || clerkId.trim().isEmpty()) {
            throw new IllegalArgumentException("Missing or empty Clerk ID in JWT claims");
        }
        return clerkId;
    }


    @Transactional
    public User registerUser(UserRegisterRequestDto requestDto) {
        if (userRepository.existsByClerkId(requestDto.getClerkId())) {
            throw new IllegalArgumentException("User already exists with Clerk ID: " + requestDto.getClerkId());
        }

        User newUser = User.builder()
                .clerkId(requestDto.getClerkId())
                .email(requestDto.getEmail())
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Registered new user via webhook with Clerk ID: {}", requestDto.getClerkId());
        return savedUser;
    }

    @Transactional
    public User updateUser(String clerkId, UserUpdateRequestDto requestDto) {
        User existingUser = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found with Clerk ID: " + clerkId));

        User updatedUser = existingUser.updateFromJwtClaims(
                requestDto.getEmail(),
                requestDto.getFirstName(),
                requestDto.getLastName()
        );

        User savedUser = userRepository.save(updatedUser);
        log.info("Updated user with Clerk ID: {}", clerkId);
        return savedUser;
    }

    @Transactional(readOnly = true)
    public User getUserByClerkId(String clerkId) {
        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found with Clerk ID: " + clerkId));
    }
}