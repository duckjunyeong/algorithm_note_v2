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

# Declare build arguments for Vite environment variables
# These must be provided at build time via docker-compose or docker build --build-arg
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLERK_SIGN_IN_URL
ARG VITE_CLERK_SIGN_UP_URL
ARG VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
ARG VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
ARG VITE_API_BASE_URL
ARG VITE_MIN_REPEAT_CYCLE_MS

# Convert ARGs to ENV variables so Vite can access them during build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_SIGN_IN_URL=$VITE_CLERK_SIGN_IN_URL
ENV VITE_CLERK_SIGN_UP_URL=$VITE_CLERK_SIGN_UP_URL
ENV VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL=$VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
ENV VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL=$VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MIN_REPEAT_CYCLE_MS=$VITE_MIN_REPEAT_CYCLE_MS

# Build frontend applications (environment variables are embedded in the bundle)
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

# Copy frontend build outputs to Spring Boot static resources before building JAR
# Landing Page → src/main/resources/static/
COPY --from=frontend-builder /app/apps/landing-page/dist ./src/main/resources/static/

# Dashboard → src/main/resources/static/dashboard/
COPY --from=frontend-builder /app/apps/dashboard/dist ./src/main/resources/static/dashboard/

# Build Spring Boot application (now includes frontend files in JAR)
RUN gradle bootJar --no-daemon

# ================================
# Stage 3: Runtime
# ================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy backend JAR (already contains frontend files)
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables (can be overridden at runtime)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
