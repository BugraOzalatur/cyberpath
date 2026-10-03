# CyberPath server: Spring Boot API with the React UI embedded (served from classpath:/static).
# Built by Gradle: ./gradlew dockerImages  (build context: cyberpath-api/build/libs)
FROM amazoncorretto:21-alpine AS builder
WORKDIR /build
COPY cyberpath-api.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

FROM amazoncorretto:21-alpine
RUN addgroup -S cyberpath && adduser -S cyberpath -G cyberpath
WORKDIR /app

# Rarely changing layers first: only the application layer is rebuilt when the code changes
COPY --from=builder --chown=cyberpath:cyberpath /build/extracted/dependencies/ ./
COPY --from=builder --chown=cyberpath:cyberpath /build/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=cyberpath:cyberpath /build/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=cyberpath:cyberpath /build/extracted/application/ ./

USER cyberpath
EXPOSE 8095

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=5 \
    CMD wget --spider -q http://localhost:8095/actuator/health || exit 1

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
