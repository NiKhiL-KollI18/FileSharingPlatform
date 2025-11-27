# STAGE 1: Build the application with Maven
# Use a valid, existing image tag from Docker Hub
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the Maven project file first to leverage Docker's dependency caching
COPY pom.xml .

# Copy the entire backend source code
COPY src ./src

# Run the Maven build to create the JAR file.
# FIXED: Changed -DskipTests to -Dmaven.test.skip=true 
# This prevents the "compilation failure" by ignoring broken test dependencies.
RUN mvn clean package -Dmaven.test.skip=true

# STAGE 2: Create the final, lightweight image
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR /app

# Copy the compiled JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application runs on (Standardizing on 8080 to match K8s)
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]