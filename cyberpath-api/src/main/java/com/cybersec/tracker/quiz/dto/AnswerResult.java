package com.cybersec.tracker.quiz.dto;

/** correct == null: the open-ended answer is waiting to be graded. */
public record AnswerResult(Long attemptId, Boolean correct, boolean pending, Integer correctIndex,
                           String explanation) {
}
