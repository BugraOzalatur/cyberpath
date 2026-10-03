CREATE TABLE topics (
    id            BIGSERIAL PRIMARY KEY,
    slug          VARCHAR(80)  NOT NULL UNIQUE,
    title         VARCHAR(200) NOT NULL,
    category      VARCHAR(30)  NOT NULL,
    summary       TEXT,
    order_index   INT          NOT NULL DEFAULT 0,
    status        VARCHAR(20)  NOT NULL DEFAULT 'NOT_STARTED',
    understanding INT CHECK (understanding BETWEEN 1 AND 5),
    notes         TEXT,
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE study_resources (
    id         BIGSERIAL PRIMARY KEY,
    topic_id   BIGINT       NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
    title      VARCHAR(200) NOT NULL,
    url        VARCHAR(500),
    kind       VARCHAR(20)  NOT NULL,
    done       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_resources_topic ON study_resources (topic_id);

CREATE TABLE tasks (
    id         BIGSERIAL PRIMARY KEY,
    topic_id   BIGINT REFERENCES topics (id) ON DELETE SET NULL,
    title      VARCHAR(300) NOT NULL,
    due_date   DATE,
    done       BOOLEAN      NOT NULL DEFAULT FALSE,
    done_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_tasks_due ON tasks (due_date);

CREATE TABLE journal_entries (
    id         BIGSERIAL PRIMARY KEY,
    entry_date DATE        NOT NULL,
    minutes    INT         NOT NULL DEFAULT 0 CHECK (minutes >= 0),
    summary    TEXT        NOT NULL,
    struggles  TEXT,
    next_goal  TEXT,
    topic_id   BIGINT REFERENCES topics (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_journal_date ON journal_entries (entry_date);

CREATE TABLE questions (
    id            BIGSERIAL PRIMARY KEY,
    topic_id      BIGINT      NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
    prompt        TEXT        NOT NULL,
    kind          VARCHAR(20) NOT NULL,
    correct_index INT,
    explanation   TEXT,
    source        VARCHAR(20) NOT NULL DEFAULT 'SEED',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_topic ON questions (topic_id);

CREATE TABLE question_options (
    question_id BIGINT       NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    position    INT          NOT NULL,
    text        VARCHAR(500) NOT NULL,
    PRIMARY KEY (question_id, position)
);

CREATE TABLE attempts (
    id             BIGSERIAL PRIMARY KEY,
    question_id    BIGINT      NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    selected_index INT,
    answer_text    TEXT,
    correct        BOOLEAN,
    feedback       TEXT,
    graded_at      TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attempts_question ON attempts (question_id);
