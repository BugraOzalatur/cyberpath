package com.cybersec.tracker.quiz;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long questionId;

    private Integer selectedIndex;

    private String answerText;

    /** null = open-ended answer not graded yet. */
    private Boolean correct;

    private String feedback;

    private Instant gradedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Attempt() {
    }

    public static Attempt choice(Long questionId, int selectedIndex, boolean correct) {
        Attempt attempt = new Attempt();
        attempt.questionId = questionId;
        attempt.selectedIndex = selectedIndex;
        attempt.correct = correct;
        attempt.gradedAt = attempt.createdAt;
        return attempt;
    }

    public static Attempt openAnswer(Long questionId, String answerText) {
        Attempt attempt = new Attempt();
        attempt.questionId = questionId;
        attempt.answerText = answerText;
        return attempt;
    }

    public void grade(boolean isCorrect, String feedbackText) {
        this.correct = isCorrect;
        this.feedback = feedbackText;
        this.gradedAt = Instant.now();
    }

    public boolean isPending() {
        return correct == null;
    }

    public Long getId() { return id; }
    public Long getQuestionId() { return questionId; }
    public Integer getSelectedIndex() { return selectedIndex; }
    public String getAnswerText() { return answerText; }
    public Boolean getCorrect() { return correct; }
    public String getFeedback() { return feedback; }
    public Instant getGradedAt() { return gradedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
