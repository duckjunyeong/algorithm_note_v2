## 데이터베이스 관점의 데이터플로우

---

### 데이터 임시 저장 (Redis)

*   사용자가 URL 또는 수동으로 문제 정보를 입력하면, 백엔드 서버는 해당 데이터를 DTO(Data Transfer Object)로 가공합니다.
*   이 DTO는 영구 데이터베이스(MySQL)에 저장되기 전, 사용자의 ID를 Key로 하여 Redis에 임시로 저장됩니다. 이는 다음 단계(예: 코드 분석)에서 데이터를 빠르게 조회하기 위함입니다.

### 데이터 영구 저장 (MySQL)

*   후속 로직(예: 사용자가 코드 제출 및 분석을 완료하는 시점)이 트리거되면, 시스템은 Redis에서 사용자 ID를 Key로 임시 저장된 문제 데이터를 조회합니다.
*   조회한 데이터를 바탕으로 Problem 엔티티 객체를 생성하여 MySQL 데이터베이스의 `problem` 테이블에 새로운 레코드로 삽입(INSERT)합니다.

### 임시 데이터 삭제 (Redis)

*   MySQL에 데이터가 성공적으로 저장되면, Redis에 있던 임시 데이터는 삭제(DELETE)하여 데이터 정합성을 유지하고 메모리 자원을 확보합니다.

---

### 최소 스펙 데이터베이스 스키마 (Spring JPA & MySQL)

유저플로우에 명시된 데이터를 기반으로, 문제 정보를 저장할 Problem 엔티티를 설계했습니다.

#### Problem.java (JPA Entity)

```java
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 시스템 내부 관리용 ID

    @Column(name = "title", nullable = false)
    private String title; // 문제 제목

    @Lob
    @Column(name = "description", nullable = false)
    private String description; // 문제 설명

    @Lob
    @Column(name = "input_condition", nullable = false)
    private String inputCondition; // 문제 입력 조건

    @Lob
    @Column(name = "output_condition", nullable = false)
    private String outputCondition; // 문제 출력 조건

    @Lob
    @Column(name = "constraints")
    private String constraints; // 문제 제한 조건 (null 가능)

    @Column(name = "url", unique = true)
    private String url; // 문제 출처 URL (수동 등록 시 null 가능, 중복 방지)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성 일시

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 수정 일시

    // Getters and Setters, Constructors, etc.
}
```