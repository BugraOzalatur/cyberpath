# dist/ is built on the host by Gradle: ./gradlew :cyberpath-ui:build (or ./gradlew dockerBuild from the root)
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/ > /dev/null || exit 1
