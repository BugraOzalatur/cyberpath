package com.cybersec.tracker.resource;

import com.cybersec.tracker.resource.dto.ResourceRequest;
import com.cybersec.tracker.resource.dto.ResourceResponse;
import com.cybersec.tracker.resource.dto.UpdateResourceRequest;
import com.cybersec.tracker.shared.exception.NotFoundException;
import com.cybersec.tracker.topic.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudyResourceService {

    private final StudyResourceRepository resourceRepository;
    private final TopicRepository topicRepository;

    public StudyResourceService(StudyResourceRepository resourceRepository, TopicRepository topicRepository) {
        this.resourceRepository = resourceRepository;
        this.topicRepository = topicRepository;
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> listForTopic(Long topicId) {
        return resourceRepository.findByTopicIdOrderByIdAsc(topicId).stream()
                .map(ResourceResponse::from)
                .toList();
    }

    public ResourceResponse create(Long topicId, ResourceRequest request) {
        if (!topicRepository.existsById(topicId)) {
            throw new NotFoundException("Topic", topicId);
        }
        StudyResource resource = new StudyResource(topicId, request.title(), blankToNull(request.url()), request.kind());
        return ResourceResponse.from(resourceRepository.save(resource));
    }

    public ResourceResponse update(Long id, UpdateResourceRequest request) {
        StudyResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Resource", id));
        if (request.title() != null) resource.setTitle(request.title());
        if (request.url() != null) resource.setUrl(blankToNull(request.url()));
        if (request.kind() != null) resource.setKind(request.kind());
        if (request.done() != null) resource.setDone(request.done());
        return ResourceResponse.from(resource);
    }

    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new NotFoundException("Resource", id);
        }
        resourceRepository.deleteById(id);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
