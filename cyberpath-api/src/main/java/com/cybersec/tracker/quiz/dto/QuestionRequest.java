package com.cybersec.tracker.quiz.dto;

import com.cybersec.tracker.quiz.QuestionKind;
import com.cybersec.tracker.quiz.QuestionSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * MULTIPLE_CHOICE: options (2-6) and correctIndex are required.
 * OPEN: explanation holds the outline of the expected answer (used when grading).
 */
public record QuestionRequest(
        @NotBlank @Size(max = 2000) String prompt,
        @NotNull QuestionKind kind,
        List<@NotBlank @Size(max = 500) String> options,
        Integer correctIndex,
        @Size(max = 4000) String explanation,
        QuestionSource source
) {
}
