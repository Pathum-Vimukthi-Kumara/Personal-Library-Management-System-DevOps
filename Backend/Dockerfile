## Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only pom first for better caching, then dependencies
COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -e -B -DskipTests package

## Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /workspace/target/DevOps_Project-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 4000
ENTRYPOINT ["java","-jar","/app/app.jar"]