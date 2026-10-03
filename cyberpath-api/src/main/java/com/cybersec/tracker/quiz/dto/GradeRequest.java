package com.cybersec.tracker.quiz.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GradeRequest(
        @NotNull Boolean correct,
        @Size(max = 4000) String feedback
) {
}
