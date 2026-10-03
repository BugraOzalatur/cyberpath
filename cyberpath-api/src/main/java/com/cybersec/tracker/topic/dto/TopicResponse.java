package com.cybersec.tracker.topic.dto;

import com.cybersec.tracker.topic.TopicCategory;
import com.cybersec.tracker.topic.TopicStatus;

import java.time.Instant;

public record TopicResponse(
        Long id,
        String slug,
        String title,
        TopicCategory category,
        String summary,
        int orderIndex,
        TopicStatus status,
        Integer understanding,
        String notes,
        Instant startedAt,
        Instant completedAt,
        TopicProgress progress
) {
}
