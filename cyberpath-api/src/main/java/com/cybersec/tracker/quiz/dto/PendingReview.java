package com.cybersec.tracker.quiz.dto;

import java.time.Instant;

/** An open-ended answer waiting to be graded via the MCP server. */
public record PendingReview(Long attemptId, Long questionId, Long topicId, String topicTitle, String prompt,
                            String expectedOutline, String answerText, Instant answeredAt) {
}
