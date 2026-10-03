package com.cybersec.tracker.topic.dto;

import com.cybersec.tracker.topic.TopicCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTopicRequest(
        @NotBlank @Size(max = 200) String title,
        @NotNull TopicCategory category,
        @Size(max = 2000) String summary
) {
}
