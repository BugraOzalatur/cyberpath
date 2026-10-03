# CyberPath

A personal learning tracker for cybersecurity: roadmap, study resources, tasks, a daily journal, per-topic comprehension questions and an exam mode. Read [ABOUT.md](ABOUT.md) for why it exists, why the roadmap is ordered the way it is, and why it builds on platforms like TryHackMe and PortSwigger. An optional MCP server lets an AI assistant read your progress, add questions for finished topics and grade open-ended answers.

| Module | Stack |
|---|---|
| `cyberpath-api` | Java 21 (Corretto), Spring Boot 4.1, JPA, Flyway, PostgreSQL 17 |
| `cyberpath-ui` | React 19, Vite, TypeScript, TanStack Query, React Router, CSS Modules (pnpm) |
| `cyberpath-mcp` | TypeScript, `@modelcontextprotocol/sdk` (stdio) |

The whole project is a multi-module Gradle build (Groovy DSL).

## Getting started

Requirements: Java 21, pnpm, Docker. Gradle comes with the wrapper.

```bash
cp .env.example .env                  # then set DB_PASSWORD (e.g. openssl rand -base64 24)
./gradlew clean dockerBuild -x test   # build → create Docker images → start the services
```

All configuration lives in `.env`, which is git-ignored. Only `.env.example` (without real values) is committed. `cyberpath-api` reads `.env` automatically when it runs outside Docker; inside Docker, compose passes the values as environment variables.

- UI: http://127.0.0.1:5180
- API: http://127.0.0.1:8095/api
- PostgreSQL: `127.0.0.1:5434` (credentials from `.env`)

| Command | What it does |
|---|---|
| `./gradlew build` | Builds `cyberpath-api` (jar + tests), `cyberpath-ui` (type check, lint, `dist/`) and `cyberpath-mcp` (`dist/`) |
| `./gradlew dockerBuild` | `build` + `docker compose up -d --build --wait`; finishes when all services are healthy |
| `./gradlew dockerDown` | Stops the services (data is kept) |
| `./gradlew dockerLogs` | Last 100 log lines |
| `./gradlew :cyberpath-api:test` | API tests only |

If pnpm is not on the `PATH`, pass it explicitly: `./gradlew dockerBuild -PpnpmPath=/opt/homebrew/bin/pnpm`

All ports are bound to `127.0.0.1`. To reset everything including the database, run `docker compose down -v`.

> The Docker images do not compile anything themselves; they copy the Gradle outputs (`cyberpath-api/build/libs/cyberpath-api.jar` and `cyberpath-ui/dist/`). Always build the images with `./gradlew dockerBuild`, not with `docker compose build`.

### Development mode (hot reload)
```bash
docker compose up -d cyberpath-db       # uses .env
./gradlew :cyberpath-api:bootRun        # :8095
cd cyberpath-ui && pnpm dev             # :5180, proxies /api to :8095
```

## MCP server

`cyberpath-mcp` exposes the tracker to MCP clients over stdio. It is built by `./gradlew build` into `cyberpath-mcp/dist/index.js`. Register it in your MCP client, for example:

```json
{
  "mcpServers": {
    "cyberpath": {
      "command": "node",
      "args": ["/absolute/path/to/cyberpath/cyberpath-mcp/dist/index.js"],
      "env": { "TRACKER_API_URL": "http://127.0.0.1:8095/api" }
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
