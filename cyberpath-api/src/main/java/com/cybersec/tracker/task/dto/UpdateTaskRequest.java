package com.cybersec.tracker.task.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Only the provided fields are updated; clearDueDate=true removes the due date. */
public record UpdateTaskRequest(
        @Size(max = 300) String title,
        Long topicId,
        LocalDate dueDate,
        Boolean clearDueDate,
        Boolean done
) {
}
