# The jar is built on the host by Gradle: ./gradlew :cyberpath-api:bootJar (or ./gradlew dockerBuild from the root)
FROM amazoncorretto:21-alpine AS extractor
WORKDIR /app
COPY build/libs/cyberpath-api.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

FROM amazoncorretto:21-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache wget && addgroup -S app && adduser -S app -G app
# Rarely changing layers first: the dependency layer is reused, only the application layer is copied again
COPY --from=extractor --chown=app:app /app/extracted/dependencies/ ./
COPY --from=extractor --chown=app:app /app/extracted/spring-boot-loader/ ./
COPY --from=extractor --chown=app:app /app/extracted/snapshot-dependencies/ ./
COPY --from=extractor --chown=app:app /app/extracted/application/ ./
USER app
EXPOSE 8095
HEALTHCHECK --interval=15s --timeout=3s --start-period=40s --retries=5 \
  CMD wget -qO- http://localhost:8095/actuator/health || exit 1
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
