package com.cybersec.tracker.journal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record JournalRequest(
        @NotNull LocalDate entryDate,
        @Min(0) @Max(1440) int minutes,
        @NotBlank @Size(max = 4000) String summary,
        @Size(max = 4000) String struggles,
        @Size(max = 1000) String nextGoal,
        Long topicId
) {
}
