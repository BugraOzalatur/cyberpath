package com.cybersec.tracker.resource;

import com.cybersec.tracker.resource.dto.ResourceRequest;
import com.cybersec.tracker.resource.dto.ResourceResponse;
import com.cybersec.tracker.resource.dto.UpdateResourceRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudyResourceController {

    private final StudyResourceService resourceService;

    public StudyResourceController(StudyResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/topics/{topicId}/resources")
    public List<ResourceResponse> list(@PathVariable Long topicId) {
        return resourceService.listForTopic(topicId);
    }

    @PostMapping("/topics/{topicId}/resources")
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceResponse create(@PathVariable Long topicId, @Valid @RequestBody ResourceRequest request) {
        return resourceService.create(topicId, request);
    }

    @PatchMapping("/resources/{id}")
    public ResourceResponse update(@PathVariable Long id, @Valid @RequestBody UpdateResourceRequest request) {
        return resourceService.update(id, request);
    }

    @DeleteMapping("/resources/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        resourceService.delete(id);
    }
}
