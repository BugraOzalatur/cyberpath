package com.cybersec.tracker.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 300) String title,
        Long topicId,
        LocalDate dueDate
) {
}
