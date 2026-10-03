package com.cybersec.tracker.topic;

import com.cybersec.tracker.topic.dto.CreateTopicRequest;
import com.cybersec.tracker.topic.dto.TopicResponse;
import com.cybersec.tracker.topic.dto.UpdateTopicRequest;
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
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    public List<TopicResponse> list() {
        return topicService.list();
    }

    @GetMapping("/{id}")
    public TopicResponse get(@PathVariable Long id) {
        return topicService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TopicResponse create(@Valid @RequestBody CreateTopicRequest request) {
        return topicService.create(request);
    }

    @PatchMapping("/{id}")
    public TopicResponse update(@PathVariable Long id, @Valid @RequestBody UpdateTopicRequest request) {
        return topicService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        topicService.delete(id);
    }
}
