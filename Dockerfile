# ================================
# Stage 1: Frontend Build
# ================================
FROM node:20-alpine AS frontend-builder

RUN corepack enable && corepack prepare pnpm@10.16.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/landing-page/package.json ./apps/landing-page/
COPY libs/ui-components/package.json ./libs/ui-components/
COPY libs/api-types/package.json ./libs/api-types/
COPY libs/core-logic/package.json ./libs/core-logic/
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_DASHBOARD_URL
ARG VITE_LANDING_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLERK_SIGN_IN_URL
ARG VITE_CLERK_SIGN_UP_URL
ARG VITE_API_BASE_URL
ARG VITE_MIN_REPEAT_CYCLE_MS

ENV VITE_DASHBOARD_URL=$VITE_DASHBOARD_URL
ENV VITE_LANDING_URL=$VITE_LANDING_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_SIGN_IN_URL=$VITE_CLERK_SIGN_IN_URL
ENV VITE_CLERK_SIGN_UP_URL=$VITE_CLERK_SIGN_UP_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MIN_REPEAT_CYCLE_MS=$VITE_MIN_REPEAT_CYCLE_MS

RUN pnpm --filter dashboard build
RUN pnpm --filter landing-page build

# ================================
# Stage 2: Backend Build
# ================================
FROM gradle:8.5-jdk17-alpine AS backend-builder

WORKDIR /app

COPY apps/backend/build.gradle apps/backend/settings.gradle ./

COPY apps/backend/gradlew ./gradlew

RUN gradle dependencies --no-daemon || true

COPY apps/backend/src ./src

COPY --from=frontend-builder /app/apps/landing-page/dist ./src/main/resources/static/

COPY --from=frontend-builder /app/apps/dashboard/dist ./src/main/resources/static/dashboard/

RUN gradle bootJar --no-daemon

# ================================
# Stage 3: Runtime
# ================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=backend-builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
