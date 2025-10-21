# ================================
# Stage 1: Frontend Build
# ================================
FROM node:20-alpine AS frontend-builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.16.0 --activate

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/landing-page/package.json ./apps/landing-page/
COPY libs/ui-components/package.json ./libs/ui-components/
COPY libs/api-types/package.json ./libs/api-types/
COPY libs/core-logic/package.json ./libs/core-logic/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend applications
RUN pnpm --filter dashboard build
RUN pnpm --filter landing-page build

# ================================
# Stage 2: Backend Build
# ================================
FROM gradle:8.5-jdk17-alpine AS backend-builder

WORKDIR /app

# Copy Gradle configuration
COPY apps/backend/build.gradle apps/backend/settings.gradle ./
COPY apps/backend/gradlew ./gradlew

# Download dependencies (cached layer)
RUN gradle dependencies --no-daemon || true

# Copy backend source code
COPY apps/backend/src ./src

# Build Spring Boot application
RUN gradle bootJar --no-daemon

# ================================
# Stage 3: Runtime
# ================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy backend JAR
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# Copy frontend build outputs to Spring Boot static resources
# Landing Page → root path (/)
COPY --from=frontend-builder /app/apps/landing-page/dist ./static/

# Dashboard → /dashboard path
COPY --from=frontend-builder /app/apps/dashboard/dist ./static/dashboard/

# Expose port
EXPOSE 8080

# Set environment variables (can be overridden at runtime)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
