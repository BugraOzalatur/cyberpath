package com.cybersec.tracker.resource;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "study_resources")
public class StudyResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long topicId;

    @Column(nullable = false)
    private String title;

    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceKind kind;

    private boolean done;

    protected StudyResource() {
    }

    public StudyResource(Long topicId, String title, String url, ResourceKind kind) {
        this.topicId = topicId;
        this.title = title;
        this.url = url;
        this.kind = kind;
    }

    public Long getId() { return id; }
    public Long getTopicId() { return topicId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public ResourceKind getKind() { return kind; }
    public void setKind(ResourceKind kind) { this.kind = kind; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}
