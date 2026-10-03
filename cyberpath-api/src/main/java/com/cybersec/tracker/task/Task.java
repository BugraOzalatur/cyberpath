package com.cybersec.tracker.task;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long topicId;

    @Column(nullable = false)
    private String title;

    private LocalDate dueDate;

    private boolean done;

    private Instant doneAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Task() {
    }

    public Task(Long topicId, String title, LocalDate dueDate) {
        this.topicId = topicId;
        this.title = title;
        this.dueDate = dueDate;
    }

    public void markDone(boolean value) {
        if (value == done) {
            return;
        }
        done = value;
        doneAt = value ? Instant.now() : null;
    }

    public Long getId() { return id; }
    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public boolean isDone() { return done; }
    public Instant getDoneAt() { return doneAt; }
    public Instant getCreatedAt() { return createdAt; }
}
