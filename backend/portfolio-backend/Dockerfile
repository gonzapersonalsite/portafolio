# Build stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy gradle wrapper and config files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Give execution permission to gradlew
RUN chmod +x gradlew

# Download dependencies (cache layer)
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build application
RUN ./gradlew build -x test --no-daemon

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
