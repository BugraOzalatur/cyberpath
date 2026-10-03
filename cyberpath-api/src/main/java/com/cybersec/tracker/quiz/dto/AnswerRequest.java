package com.cybersec.tracker.quiz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record AnswerRequest(
        @Min(0) Integer selectedIndex,
        @Size(max = 8000) String answerText
) {
}
