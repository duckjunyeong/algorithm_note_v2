package algorithm_note.algorithm_note_v2.category.service;

import algorithm_note.algorithm_note_v2.category.domain.Category;
import algorithm_note.algorithm_note_v2.category.dto.CategoryCreateRequestDto;
import algorithm_note.algorithm_note_v2.category.dto.CategoryResponseDto;
import algorithm_note.algorithm_note_v2.category.exception.CategoryNotFoundException;
import algorithm_note.algorithm_note_v2.category.exception.DuplicateCategoryException;
import algorithm_note.algorithm_note_v2.category.repository.CategoryRepository;
import algorithm_note.algorithm_note_v2.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Category business logic service
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Create a new category.
     *
     * @param requestDto Category creation request DTO
     * @param user User who creates the category
     * @return Created category response DTO
     * @throws DuplicateCategoryException if category with the same name already exists
     */
    @Transactional
    public CategoryResponseDto createCategory(CategoryCreateRequestDto requestDto, User user) {
        log.info("Creating category for user: {}, name: {}", user.getId(), requestDto.getName());

        // Check for duplicate category name
        if (categoryRepository.existsByUserAndName(user, requestDto.getName())) {
            throw new DuplicateCategoryException("이미 사용 중인 카테고리 이름입니다: " + requestDto.getName());
        }

        // Check for duplicate category color
        if (categoryRepository.existsByUserAndColor(user, requestDto.getColor())) {
            throw new DuplicateCategoryException("이미 사용 중인 색상입니다. 다른 색상을 선택해주세요.");
        }

        // Create and save category
        Category category = Category.builder()
                .user(user)
                .name(requestDto.getName())
                .color(requestDto.getColor())
                .build();

        Category savedCategory = categoryRepository.save(category);

        log.info("Successfully created category with ID: {}", savedCategory.getCategoryId());

        return CategoryResponseDto.from(savedCategory);
    }

    /**
     * Get all categories for a user.
     *
     * @param user User entity
     * @return List of category response DTOs
     */
    public List<CategoryResponseDto> getCategoriesByUser(User user) {
        log.info("Fetching categories for user: {}", user.getId());

        List<Category> categories = categoryRepository.findAllByUserOrderByCreatedAtDesc(user);

        log.info("Found {} categories for user: {}", categories.size(), user.getId());

        return categories.stream()
                .map(CategoryResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific category by ID.
     *
     * @param categoryId Category ID
     * @param user User entity (for authorization)
     * @return Category response DTO
     * @throws CategoryNotFoundException if category not found or doesn't belong to user
     */
    public CategoryResponseDto getCategoryById(Long categoryId, User user) {
        log.info("Fetching category with ID: {} for user: {}", categoryId, user.getId());

        Category category = categoryRepository.findByCategoryIdAndUser(categoryId, user)
                .orElseThrow(() -> new CategoryNotFoundException("카테고리를 찾을 수 없습니다."));

        return CategoryResponseDto.from(category);
    }

    /**
     * Find a category entity by ID and user (for internal use by other services).
     *
     * @param categoryId Category ID
     * @param user User entity
     * @return Category entity
     * @throws CategoryNotFoundException if not found
     */
    public Category findCategoryByIdAndUser(Long categoryId, User user) {
        return categoryRepository.findByCategoryIdAndUser(categoryId, user)
                .orElseThrow(() -> new CategoryNotFoundException("카테고리를 찾을 수 없습니다."));
    }

    /**
     * Delete a category.
     *
     * @param categoryId Category ID
     * @param user User entity (for authorization)
     * @throws CategoryNotFoundException if category not found
     */
    @Transactional
    public void deleteCategory(Long categoryId, User user) {
        log.info("Deleting category with ID: {} for user: {}", categoryId, user.getId());

        Category category = categoryRepository.findByCategoryIdAndUser(categoryId, user)
                .orElseThrow(() -> new CategoryNotFoundException("카테고리를 찾을 수 없습니다."));

        categoryRepository.delete(category);

        log.info("Successfully deleted category with ID: {}", categoryId);
    }
}
