# CyberPath

A personal learning tracker for cybersecurity: roadmap, study resources, tasks, a daily journal, per-topic comprehension questions and an exam mode. Read [ABOUT.md](ABOUT.md) for why it exists, why the roadmap is ordered the way it is, and why it builds on platforms like TryHackMe and PortSwigger. An optional MCP server lets an AI assistant read your progress, add questions for finished topics and grade open-ended answers.

| Module | Stack |
|---|---|
| `cyberpath-api` | Java 21 (Corretto), Spring Boot 4.1, JPA, Flyway, PostgreSQL 17 |
| `cyberpath-ui` | React 19, Vite, TypeScript, TanStack Query, React Router, CSS Modules (pnpm) |
| `cyberpath-mcp` | TypeScript, `@modelcontextprotocol/sdk` (stdio) |
| `cyberpath-assembly` | Packaging only (no sources): embeds the UI into the server jar, builds the Docker image and the distributions |

The whole project is a multi-module Gradle build (Groovy DSL). The UI is bundled into the Spring Boot jar, so the API and the web app ship as **one server** (`cyberpath/server` image) next to PostgreSQL.

## Getting started

Requirements: Java 21, pnpm, Docker. Gradle comes with the wrapper.

```bash
cp .env.example .env                  # then set DB_PASSWORD (e.g. openssl rand -base64 24)
./gradlew clean dockerBuild -x test   # build → embed UI → build the image → start server + PostgreSQL
```

- Web app and API: http://127.0.0.1:5180 (API under `/api`)
- PostgreSQL: `127.0.0.1:5434` (credentials from `.env`)

| Command | What it does |
|---|---|
| `./gradlew build` | Builds `cyberpath-api` (jar + tests), `cyberpath-ui` (type check, lint, `dist/`) and `cyberpath-mcp` (`dist/`) |
| `./gradlew dockerBuild` | `build` + Docker image + `docker compose up -d --wait`; finishes when everything is healthy |
| `./gradlew dockerImages` | Only builds the `cyberpath/server` image |
| `./gradlew dockerDown` / `dockerLogs` | Stops the local stack (data is kept) / shows its logs |
| `./gradlew buildDistributions` | `cyberpath-assembly/build/distributions/cyberpath-<version>.zip` and `.tar.gz` (see below) |
| `./gradlew buildDockerDist` | `cyberpath-assembly/build/distributions/cyberpath-docker-<version>.tar.gz` (see below) |
| `./gradlew :cyberpath-api:test` | API tests only |

If pnpm is not found (e.g. when Gradle runs from an IDE), pass it explicitly: `./gradlew dockerBuild -PpnpmPath=/opt/homebrew/bin/pnpm`

All ports are bound to `127.0.0.1`. To reset everything including the database: `docker compose --project-directory . -f cyberpath-assembly/docker/docker-compose.yml down -v`.

### Development mode (hot reload)
```bash
docker compose --project-directory . -f cyberpath-assembly/docker/docker-compose.yml up -d cyberpath-db
./gradlew :cyberpath-api:bootRun        # :8095
cd cyberpath-ui && pnpm dev             # :5180, proxies /api to :8095
```

## Distributions

`cyberpath-assembly` produces two archives for running CyberPath on another machine without the source code. The version comes from `gradle.properties`.

**Docker distribution** (`cyberpath-docker-<version>.tar.gz`): the saved server image, a `docker-compose.yml` with PostgreSQL, the server configuration and load scripts.

```bash
tar -xzf cyberpath-docker-0.1.0.tar.gz && cd cyberpath-docker-0.1.0
./load-images.sh                 # or load-images.bat
cp .env.example .env             # set DB_PASSWORD
docker compose up -d             # → http://127.0.0.1:5180
```

**Service distribution** (`cyberpath-<version>.zip` / `.tar.gz`): the server jar, `server/application.properties`, start scripts (`bin/server.sh`, `bin/server.bat`) and service definitions for systemd (Linux) and WinSW (Windows). It needs Java 21 and an existing PostgreSQL database.

```bash
sudo ./install-service.sh        # installs to /opt/cyberpath as a hardened systemd service
# create the database, set the password in /opt/cyberpath/server/application.properties, then:
sudo systemctl enable --now cyberpath-server   # → http://127.0.0.1:8095
```

On Windows, run `install-service.bat` as Administrator (installs to `C:\cyberpath` with WinSW).

## MCP server

`cyberpath-mcp` exposes the tracker to MCP clients over stdio. It is built by `./gradlew build` into `cyberpath-mcp/dist/index.js`. Register it in your MCP client, for example:

```json
{
  "mcpServers": {
    "cyberpath": {
      "command": "node",
      "args": ["/absolute/path/to/cyberpath/cyberpath-mcp/dist/index.js"],
      "env": { "TRACKER_API_URL": "http://127.0.0.1:5180/api" }
    }
  }
}
```

| Tool | Purpose |
|---|---|
| `get_progress_overview` | Stats and the status of every topic |
| `get_topic` | Topic details: notes, resources, tasks, questions |
| `add_question` | Adds a multiple-choice or open-ended question to a topic |
| `list_pending_answers` / `grade_answer` | Lists and grades open-ended answers |
| `add_task`, `add_resource`, `create_topic`, `update_topic_status`, `list_journal` | Manage tracker data |

## How progress is calculated
- **Topic progress:** the average of the completed-resource ratio and the correctly-answered-question ratio. It never reaches 100% until the topic is marked as completed.
- **Quiz accuracy:** based on the latest attempt of each question.
- **"Needs review":** shown when a topic is marked as completed but its quiz score is below 70% or the self-assessment is 2/5 or lower.

## API overview
| Method | Path |
|---|---|
| GET/POST | `/api/topics`, GET/PATCH/DELETE `/api/topics/{id}` |
| GET/POST | `/api/topics/{id}/resources`, PATCH/DELETE `/api/resources/{id}` |
| GET/POST | `/api/tasks?scope=TODAY\|WEEK\|ALL&topicId=`, PATCH/DELETE `/api/tasks/{id}` |
| GET/POST | `/api/journal?from=&to=`, PUT/DELETE `/api/journal/{id}` |
| GET/POST | `/api/topics/{id}/questions`, DELETE `/api/questions/{id}` |
| POST | `/api/questions/{id}/attempts` |
| GET | `/api/attempts/pending`, PATCH `/api/attempts/{id}/grade` |
| GET | `/api/quiz/exam?topicIds=&size=` |
| GET | `/api/dashboard` |

> There is no authentication. CyberPath is meant to run locally (127.0.0.1) only; do not expose it to the internet.
