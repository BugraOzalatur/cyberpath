package com.cybersec.tracker.topic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TopicCategory category;

    private String summary;

    private int orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TopicStatus status = TopicStatus.NOT_STARTED;

    private Integer understanding;

    private String notes;

    private Instant startedAt;

    private Instant completedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Topic() {
    }

    public Topic(String slug, String title, TopicCategory category, String summary, int orderIndex) {
        this.slug = slug;
        this.title = title;
        this.category = category;
        this.summary = summary;
        this.orderIndex = orderIndex;
    }

    public void changeStatus(TopicStatus newStatus) {
        if (newStatus == status) {
            return;
        }
        Instant now = Instant.now();
        if (newStatus != TopicStatus.NOT_STARTED && startedAt == null) {
            startedAt = now;
        }
        completedAt = newStatus == TopicStatus.COMPLETED ? now : null;
        if (newStatus == TopicStatus.NOT_STARTED) {
            startedAt = null;
        }
        status = newStatus;
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public TopicCategory getCategory() { return category; }
    public void setCategory(TopicCategory category) { this.category = category; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    public TopicStatus getStatus() { return status; }
    public Integer getUnderstanding() { return understanding; }
    public void setUnderstanding(Integer understanding) { this.understanding = understanding; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
}
