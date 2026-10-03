package com.cybersec.tracker.resource.dto;

import com.cybersec.tracker.resource.ResourceKind;
import com.cybersec.tracker.resource.StudyResource;

public record ResourceResponse(Long id, Long topicId, String title, String url, ResourceKind kind, boolean done) {

    public static ResourceResponse from(StudyResource resource) {
        return new ResourceResponse(resource.getId(), resource.getTopicId(), resource.getTitle(),
                resource.getUrl(), resource.getKind(), resource.isDone());
    }
}
