# AlgoRevise Code Guideline

## 1. Project Overview

AlgoRevise is an AI-powered algorithm problem management platform built using React for the frontend and Spring Boot for the backend. The platform provides AI analysis and visualization of problem-solving logic, AI chatbot support for identifying weaknesses, and custom test problem generation. Key architectural decisions include a component-based React frontend, a RESTful API for communication, a layered Spring Boot backend, and the use of Spring Data JPA for database interaction.

## 2. Core Principles

*   **Maintainability**: Code should be easy to understand, modify, and debug.
*   **Testability**: Code should be designed to facilitate unit and integration testing.
*   **Readability**: Code should be clear, concise, and well-documented.
*   **Performance**: Code should be efficient and optimized for speed and resource usage.
*   **Security**: Code should be written with security in mind, preventing common vulnerabilities.

## 3. Language-Specific Guidelines

### 3.1. React (Frontend)

*   **File Organization**:
    *   Components: `src/components/` (Reusable UI elements)
    *   Pages: `src/pages/` (Route-specific components)
    *   Services: `src/services/` (API interaction logic)
    *   Utils: `src/utils/` (Utility functions)
    *   Types: `src/types/` (Global Type definitions)
*   **Import/Dependency Management**:
    *   Use absolute imports (`src/`) for internal modules.
    *   Declare dependencies in `package.json` and use `npm` or `yarn`.
*   **Error Handling**:
    *   Use `try...catch` blocks for handling API errors.
    *   Implement error boundary components for catching rendering errors.

### 3.2. Spring Boot (Backend)

*   **File Organization**:
    *   Controllers: `src/main/java/com/example/algorevise/controller/` (REST API endpoints)
    *   Services: `src/main/java/com/example/algorevise/service/` (Business logic)
    *   Repositories: `src/main/java/com/example/algorevise/repository/` (Data access)
    *   Models: `src/main/java/com/example/algorevise/model/` (Entities)
    *   DTOs: `src/main/java/com/example/algorevise/dto/` (Data Transfer Objects)
    *   Config: `src/main/java/com/example/algorevise/config/` (Configuration files)
*   **Import/Dependency Management**:
    *   Use Maven (`pom.xml`) for dependency management.
    *   Organize dependencies into logical groups.
*   **Error Handling**:
    *   Use `@ControllerAdvice` for global exception handling.
    *   Return appropriate HTTP status codes and error messages in API responses.

### 3.3. Python (AI Analysis Server - if applicable)

*   **File Organization**:
    *   Models: `src/models/` (Machine learning models)
    *   Utils: `src/utils/` (Utility functions)
    *   Main script: `src/main.py` (Server entry point)
*   **Import/Dependency Management**:
    *   Use `requirements.txt` for dependency management.
    *   Use virtual environments (`venv`) to isolate dependencies.
*   **Error Handling**:
    *   Use `try...except` blocks to handle exceptions.
    *   Implement logging for debugging and monitoring.

## 4. Code Style Rules

### 4.1. MUST Follow:

#### 4.1.1. React (Frontend)

*   **Functional Components**: Use functional components with hooks for state management and side effects.
    *   Rationale: Promotes code reusability, testability, and readability.
    ```typescript
    // MUST: Functional Component with Hooks
    import React, { useState } from 'react';

    const MyComponent: React.FC = () => {
      const [count, setCount] = useState(0);

      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    };
    ```
*   **TypeScript**: Use TypeScript for type safety and improved code maintainability.
    *   Rationale: Prevents runtime errors and facilitates code refactoring.
    ```typescript
    // MUST: TypeScript interface
    interface User {
      id: number;
      name: string;
      email: string;
    }

    const greetUser = (user: User) => {
      console.log(`Hello, ${user.name}!`);
    };
    ```
*   **Consistent Naming**: Use consistent naming conventions for variables, functions, and components (e.g., `camelCase` for variables and functions, `PascalCase` for components).
    *   Rationale: Improves code readability and maintainability.
*   **Immutability**: Treat state as immutable and use appropriate methods to update it (e.g., spread operator).
    *   Rationale: Prevents unexpected side effects and simplifies state management.
    ```typescript
    // MUST: Immutable state update
    const updateArray = (index: number, newValue: any) => {
      setMyArray(prevArray => [
        ...prevArray.slice(0, index),
        newValue,
        ...prevArray.slice(index + 1)
      ]);
    };
    ```

#### 4.1.2. Spring Boot (Backend)

*   **Layered Architecture**: Adhere to a layered architecture (Controller, Service, Repository) for separation of concerns.
    *   Rationale: Improves code organization, testability, and maintainability.
*   **Dependency Injection**: Use dependency injection to manage dependencies between components.
    *   Rationale: Promotes loose coupling and testability.
    ```java
    // MUST: Dependency Injection
    @Service
    public class UserService {

      private final UserRepository userRepository;

      @Autowired
      public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
      }

      // ...
    }
    ```
*   **RESTful API Design**: Follow RESTful principles for API design (e.g., use appropriate HTTP methods, status codes, and resource naming).
    *   Rationale: Ensures consistency and interoperability.
*   **Spring Data JPA**: Utilize Spring Data JPA for database interactions.
    *   Rationale: Simplifies data access and reduces boilerplate code.
    ```java
    // MUST: Spring Data JPA Repository
    import org.springframework.data.jpa.repository.JpaRepository;
    import com.example.algorevise.model.User;

    public interface UserRepository extends JpaRepository<User, Long> {
      // Custom query methods can be defined here
    }
    ```
*   **DTOs**: Use Data Transfer Objects (DTOs) for transferring data between layers.
    *   Rationale: Decouples data models from API contracts and allows for data transformation.
*   **Logging**: Use a logging framework (e.g., SLF4J) for logging application events.
    *   Rationale: Facilitates debugging, monitoring, and auditing.

#### 4.1.3. General

*   **Code Comments**: Write clear and concise comments to explain complex logic or non-obvious code.
    *   Rationale: Improves code understanding and maintainability.
*   **Unit Tests**: Write unit tests for all critical components and functions.
    *   Rationale: Ensures code quality and prevents regressions.
*   **Error Handling**: Implement robust error handling to prevent application crashes and provide informative error messages.
    *   Rationale: Improves application stability and user experience.

### 4.2. MUST NOT Do:

#### 4.2.1. React (Frontend)

*   **Direct DOM Manipulation**: Avoid direct DOM manipulation using `document.getElementById` or similar methods. Use React's virtual DOM instead.
    *   Rationale: Can lead to performance issues and inconsistencies.
    ```typescript
    // MUST NOT: Direct DOM manipulation
    // document.getElementById('myElement').innerHTML = 'Hello!';

    // MUST: Use React's state and rendering
    const [text, setText] = useState('Hello!');
    // ...
    <div id="myElement">{text}</div>
    ```
*   **Mutating State Directly**: Do not directly mutate the state object. Use `setState` or the hook equivalent to trigger re-renders.
    *   Rationale: Direct mutation can lead to unexpected behavior and prevent React from properly updating the UI.
    ```typescript
    // MUST NOT: Direct state mutation
    // this.state.count = 5; // Incorrect

    // MUST: Use setState or useState hook
    setCount(5); // Correct
    ```
*   **Ignoring Linter Warnings**: Do not ignore linter warnings or errors. Address them promptly to maintain code quality.
    *   Rationale: Linters help identify potential issues and enforce coding standards.

#### 4.2.2. Spring Boot (Backend)

*   **Catching Generic Exceptions**: Avoid catching generic `Exception` without specific handling.
    *   Rationale: Can hide underlying issues and make debugging difficult.
    ```java
    // MUST NOT: Catching generic Exception
    // try {
    //   // ...
    // } catch (Exception e) {
    //   // ...
    // }

    // MUST: Catch specific exceptions
    try {
      // ...
    } catch (SQLException e) {
      // Handle database-related errors
    } catch (IOException e) {
      // Handle file-related errors
    }
    ```
*   **Ignoring Exceptions**: Never ignore exceptions without logging or handling them.
    *   Rationale: Can lead to hidden errors and application instability.
*   **Writing Complex Logic in Controllers**: Avoid writing complex business logic directly in controllers. Move it to the service layer.
    *   Rationale: Keeps controllers clean and promotes separation of concerns.
*   **Hardcoding Configuration**: Avoid hardcoding configuration values (e.g., database URLs, API keys). Use environment variables or configuration files.
    *   Rationale: Improves application portability and security.

#### 4.2.3. General

*   **Long Methods/Functions**: Avoid writing long methods or functions that perform multiple tasks. Break them down into smaller, more manageable units.
    *   Rationale: Improves code readability and testability.
*   **Magic Numbers/Strings**: Avoid using magic numbers or strings directly in the code. Define them as constants with meaningful names.
    *   Rationale: Improves code readability and maintainability.
    ```java
    // MUST NOT: Magic number
    // if (user.getAge() > 18) { ... }

    // MUST: Constant
    private static final int ADULT_AGE = 18;
    if (user.getAge() > ADULT_AGE) { ... }
    ```
*   **Nested Conditional Statements**: Avoid deeply nested conditional statements. Use guard clauses or other techniques to simplify the logic.
    *   Rationale: Improves code readability and reduces complexity.

## 5. Architecture Patterns

### 5.1. Component/Module Structure Guidelines

*   **Frontend (React)**:
    *   **Atomic Design**: Consider using Atomic Design principles to structure components (Atoms, Molecules, Organisms, Templates, Pages).
    *   **Container/Presentational Components**: Separate container components (which handle data fetching and state management) from presentational components (which focus on rendering UI).
*   **Backend (Spring Boot)**:
    *   **Domain-Driven Design (DDD)**: Apply DDD principles to structure the backend code around business domains.
    *   **Microservices**: Consider using a microservices architecture for scalability and maintainability (if the application becomes very large and complex).

### 5.2. Data Flow Patterns

*   **Unidirectional Data Flow (React)**: Follow the unidirectional data flow pattern in React, where data flows from parent to child components.
*   **RESTful API (Frontend/Backend)**: Use RESTful APIs for communication between the frontend and backend.
*   **Event-Driven Architecture (Backend)**: Consider using an event-driven architecture for asynchronous communication between services.

### 5.3. State Management Conventions (React)

*   **Context API**: Use React's Context API for managing global state that is accessed by many components.
*   **Redux (Optional)**: Consider using Redux for more complex state management scenarios, especially when dealing with asynchronous actions and data persistence.
*   **Centralized Store**: Store the application state in a centralized store for predictable state management.

### 5.4. API Design Standards

*   **RESTful Principles**: Adhere to RESTful principles for API design.
*   **Consistent Naming**: Use consistent naming conventions for API endpoints and request/response parameters.
*   **Versioning**: Use API versioning to maintain backward compatibility.
*   **Authentication/Authorization**: Implement proper authentication and authorization mechanisms to secure API endpoints.
*   **Error Handling**: Return informative error messages and appropriate HTTP status codes for API errors.
*   **Data Validation**: Validate all incoming data to prevent invalid data from being processed.
    *   Rationale: Prevents security vulnerabilities and ensures data integrity.
*   **Input Sanitization**: Sanitize all user inputs to prevent XSS and other injection attacks.
    *   Rationale: Improves application security.
```java
    // MUST: Validate input
    @PostMapping("/problems")
    public ResponseEntity<?> createProblem(@Valid @RequestBody ProblemDTO problemDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        // ...
    }
```
```typescript
// MUST: Validate input
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```
