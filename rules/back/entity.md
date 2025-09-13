```markdown
## Spring Boot JPA Entity Writing Rules

This document defines the mandatory rules for writing JPA Entities to maintain consistency and stability within the project.

### Core Principles

*   **Immutability Orientation**: Entity objects should have values assigned only at creation time, and state changes should be minimized thereafter. Avoid indiscriminate use of Setters to maintain data integrity.
*   **Clear Creation Responsibility**: Object creation must be enforced exclusively through the Builder pattern, ensuring clarity and flexibility in the object creation process.

### 1. Annotation Rules

#### 1.1. Class-Level Annotations

The following annotations are used by default for Entity classes:

```java
@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
```

| Annotation                                  | Description                                                                                                                                                                                                                                                               |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@Entity`                                   | Specifies that this is a JPA-managed entity class.                                                                                                                                                                                                                        |
| `@Getter`                                   | Automatically generates Getter methods for all fields. `@Setter` is not used.                                                                                                                                                                                             |
| `@Builder`                                  | Supports creating objects using the Builder pattern.                                                                                                                                                                                                                      |
| `@NoArgsConstructor(access = AccessLevel.PROTECTED)` | A default constructor is required by JPA specification. Access is restricted to `PROTECTED` to prevent indiscriminate external creation.                                                                                                                                  |
| `@AllArgsConstructor(access = AccessLevel.PRIVATE)` | Generates a constructor including all fields. Access is restricted to `PRIVATE` to enforce creation via the Builder pattern.                                                                                                                                                           |

#### 1.2. Forbidden Annotations

**Warning: The `@Data` annotation must never be used.**

*   `@Data`: This annotation includes `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, and other annotations.
    *   Unintended `@Setter` can be exposed, allowing the object's state to be easily modified.
    *   `@ToString` can cause circular references in bidirectional relationships, leading to `StackOverflowError`.
    *   `@EqualsAndHashCode` can compare association fields, leading to performance degradation and unexpected issues.
*   `@Setter`: Its use is forbidden as it can compromise Entity consistency. If state changes are required, implement them via clearly intentioned business methods (e.g., `updatePassword(String newPassword)`).

### 2. Object Creation Rules

Entity objects must be created using the Builder pattern.

**O (Correct Example)**

```java
User user = User.builder()
                .username("John Doe")
                .userId("john123")
                .password("encoded_password")
                .build();
```

**X (Incorrect Example)**

```java
// Compile-time error because NoArgsConstructor is PROTECTED
User user1 = new User();

// Compile-time error because AllArgsConstructor is PRIVATE
User user2 = new User(1L, "John Doe", ...);
```

### 3. Field Declaration Rules

#### 3.1. Basic Fields

*   The Primary Key uses `@Id` and `@GeneratedValue(strategy = GenerationType.IDENTITY)`.
*   Table column properties are clearly defined using the `@Column` annotation (e.g., `unique`, `nullable`).

#### 3.2. Association Fields (Collection)

Collection-type fields such as `@OneToMany`, `@ManyToMany` must be initialized at the time of field declaration.

This prevents `NullPointerException` and ensures that even if the field is omitted when using the Builder pattern, it safely defaults to an empty collection.

**O (Correct Example)**

```java
@OneToMany(mappedBy = "user")
@Builder.Default // Initialize with default value when using Builder pattern
private List<Problem> problems = new ArrayList<>();
```

**X (Incorrect Example)**

```java
@OneToMany(mappedBy = "user")
private List<Problem> problems; // Potential for NPE
```

#### 3.3. Bidirectional Associations and JSON Serialization

To resolve infinite loop issues during JSON serialization in bidirectional associations, use **`@JsonManagedReference`** and **`@JsonBackReference`**.

Generally, `@JsonManagedReference` is used on the parent entity corresponding to "One", and `@JsonBackReference` is used on the child entity corresponding to "Many".

### Full Code Example (Rules Applied)

```java
package algorithm_note.auth.entity;

import algorithm_note.note.entity.Problem;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, nullable = false)
    private String userId;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonManagedReference
    private Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    private List<Problem> problems = new ArrayList<>();
}
```
```