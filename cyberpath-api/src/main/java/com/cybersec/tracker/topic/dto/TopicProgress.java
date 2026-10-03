package com.cybersec.tracker.topic.dto;

/**
 * @param mastery share of correctly answered questions (0-100), null when the topic has no questions
 * @param needsReview the topic is marked as completed but the quiz result or self-assessment is low
 */
public record TopicProgress(
        int resourcesDone,
        int resourcesTotal,
        int questionsPassed,
        int questionsTotal,
        int pendingReviews,
        int openTasks,
        Integer mastery,
        int percent,
        boolean needsReview
) {
}
