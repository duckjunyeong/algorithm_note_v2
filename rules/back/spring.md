## Core Architectural Rules

### 1. Package-by-Feature Structure

Code must be organized **around features**. This means that all related components (controllers, services, DTOs, etc.) for a specific feature are placed together under a single feature package, increasing cohesion and improving maintainability.

-   **Top-level Packages:** Create a top-level package for each feature. (e.g., `user`, `product`, `order`)
-   **Sub-layer Packages:** Within each feature package, create sub-packages for layers such as `controller`, `service`, `dto`, `repository`, and `domain` (or `entity`), and place the corresponding classes within them.

**Good Example:**

```
com.example.project
└── user
    ├── controller
    │   └── UserController.java
    ├── service
    │   └── UserService.java
    ├── dto
    │   ├── UserRequestDto.java
    │   └── UserResponseDto.java
    ├── repository
    │   └── UserRepository.java
    └── domain
        └── User.java
```

### 2. Centralized Exception Handling

For consistency and robustness of the application, exception handling must be managed in a centralized manner.

-   **No `try-catch` in Business Logic:** `Controller` and `Service` layers **must not** use `try-catch` blocks to handle business-specific exceptions (e.g., `UserNotFoundException`, `InvalidInputException`). Instead, these exceptions should be `throw`n to the caller.
-   **Use `@RestControllerAdvice`:** A **global exception handler (`GlobalExceptionHandler`) class must be implemented** using the `@RestControllerAdvice` annotation.
-   **Consistent Responses:** This handler will intercept all custom exceptions and return a consistent format of HTTP error responses (e.g., JSON-formatted error messages and status codes) to the client.

**Example in Service Layer:**

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDto findUserById(Long id) {
        // Throws UserNotFoundException if user is not found
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("Could not find user with ID: " + id));
        return UserResponseDto.from(user);
    }
}
```

**Example in Global Exception Handler:**

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles UserNotFoundException
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        ErrorResponse response = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Handles other common exceptions (optional)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // ... other exception handlers
}

// Example ErrorResponse DTO
class ErrorResponse {
    private int status;
    private String message;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getter methods
    public int getStatus() { return status; }
    public String getMessage() { return message; }
}
```

### 3. Other Core Principles

-   **DTO Usage:**
    `Controller`s **must never** directly return or receive `Entity` objects as parameters. Always use **DTOs (Data Transfer Objects)** for `Request/Response` purposes to pass data between layers. This reduces coupling between layers, controls data exposure, and helps separate presentation logic from domain logic.

-   **Dependency Injection:**
    Field injection (`@Autowired` on field) is **strictly forbidden**. Only **constructor injection** must be used. It is recommended to use the `@RequiredArgsConstructor` annotation along with the `final` keyword for concise code. Constructor injection ensures immutability, makes circular dependencies easier to detect, and facilitates testing.

-   **RESTful Naming:**
    API endpoints must strictly adhere to **RESTful principles (resources as nouns, actions as HTTP Methods)**.
    -   Resources are typically represented by plural nouns (e.g., `/users`, `/products`).
    -   HTTP Methods are used to clearly indicate CRUD (Create, Read, Update, Delete) actions:
        -   `POST /users` (Create)
        -   `GET /users` (Retrieve all)
        -   `GET /users/{id}` (Retrieve single)
        -   `PUT /users/{id}` (Full update)
        -   `PATCH /users/{id}` (Partial update)
        -   `DELETE /users/{id}` (Delete)
    -   URIs should be hierarchical and predictable.