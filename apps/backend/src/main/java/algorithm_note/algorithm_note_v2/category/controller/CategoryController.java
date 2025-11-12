package algorithm_note.algorithm_note_v2.category.controller;

import algorithm_note.algorithm_note_v2.category.dto.CategoryCreateRequestDto;
import algorithm_note.algorithm_note_v2.category.dto.CategoryResponseDto;
import algorithm_note.algorithm_note_v2.category.service.CategoryService;
import algorithm_note.algorithm_note_v2.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(
            @Valid @RequestBody CategoryCreateRequestDto requestDto) {

        log.info("Creating category with name: {}", requestDto.getName());

        User currentUser = getCurrentUser();
        CategoryResponseDto response = categoryService.createCategory(requestDto, currentUser);

        log.info("Successfully created category with ID: {}", response.getCategoryId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getCategories() {
        log.info("Fetching all categories for authenticated user");

        User currentUser = getCurrentUser();
        List<CategoryResponseDto> categories = categoryService.getCategoriesByUser(currentUser);

        log.info("Found {} categories for user", categories.size());

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDto> getCategory(
            @PathVariable Long categoryId) {

        log.info("Fetching category with ID: {}", categoryId);

        User currentUser = getCurrentUser();
        CategoryResponseDto category = categoryService.getCategoryById(categoryId, currentUser);

        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("Deleting category with ID: {}", categoryId);

        User currentUser = getCurrentUser();
        categoryService.deleteCategory(categoryId, currentUser);

        log.info("Successfully deleted category with ID: {}", categoryId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new RuntimeException("유효하지 않은 사용자 정보입니다.");
        }

        return (User) principal;
    }
}
