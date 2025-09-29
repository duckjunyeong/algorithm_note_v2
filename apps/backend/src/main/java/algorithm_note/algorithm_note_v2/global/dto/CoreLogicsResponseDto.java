package algorithm_note.algorithm_note_v2.global.dto;

import algorithm_note.algorithm_note_v2.problem.dto.CodeAnalysisResponseDto;
import algorithm_note.algorithm_note_v2.problem.dto.LogicalUnitDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 핵심 로직 응답 DTO
 * Gemini API로부터 받은 코드 분석 결과를 담는 DTO
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoreLogicsResponseDto {

    private List<CodeAnalysisResponseDto> coreLogics;

    /**
     * 성공적인 응답을 생성하는 팩토리 메서드
     */
    public static CoreLogicsResponseDto success(List<CodeAnalysisResponseDto> coreLogics) {
        return CoreLogicsResponseDto.builder()
                .coreLogics(coreLogics)
                .build();
    }
}