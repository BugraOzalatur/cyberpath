package com.cybersec.tracker.topic.dto;

import com.cybersec.tracker.topic.TopicCategory;
import com.cybersec.tracker.topic.TopicStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/** Only the provided (non-null) fields are updated. */
public record UpdateTopicRequest(
        @Size(max = 200) String title,
        TopicCategory category,
        @Size(max = 2000) String summary,
        TopicStatus status,
        @Min(1) @Max(5) Integer understanding,
        String notes
) {
}
