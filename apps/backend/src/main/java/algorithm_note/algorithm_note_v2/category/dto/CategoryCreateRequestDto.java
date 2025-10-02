package algorithm_note.algorithm_note_v2.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Category creation request DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCreateRequestDto {

    @NotBlank(message = "카테고리 이름을 입력해주세요")
    @Size(max = 100, message = "카테고리 이름은 100자 이내로 작성해주세요")
    private String name;

    @NotBlank(message = "색상을 선택해주세요")
    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "유효한 색상 코드를 입력해주세요 (예: #3B82F6)")
    private String color;
}
