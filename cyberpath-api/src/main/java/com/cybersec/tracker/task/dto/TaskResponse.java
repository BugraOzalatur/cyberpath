package com.cybersec.tracker.task.dto;

import com.cybersec.tracker.task.Task;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(Long id, Long topicId, String title, LocalDate dueDate, boolean done, Instant doneAt,
                           boolean overdue) {

    public static TaskResponse from(Task task, LocalDate today) {
        boolean overdue = !task.isDone() && task.getDueDate() != null && task.getDueDate().isBefore(today);
        return new TaskResponse(task.getId(), task.getTopicId(), task.getTitle(), task.getDueDate(),
                task.isDone(), task.getDoneAt(), overdue);
    }
}
