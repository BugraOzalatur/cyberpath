package com.cybersec.tracker.quiz.dto;

import com.cybersec.tracker.quiz.Attempt;

import java.time.Instant;

public record LastAttempt(Long id, Integer selectedIndex, String answerText, Boolean correct, boolean pending,
                          String feedback, Instant createdAt) {

    public static LastAttempt from(Attempt attempt) {
        return new LastAttempt(attempt.getId(), attempt.getSelectedIndex(), attempt.getAnswerText(),
                attempt.getCorrect(), attempt.isPending(), attempt.getFeedback(), attempt.getCreatedAt());
    }
}
