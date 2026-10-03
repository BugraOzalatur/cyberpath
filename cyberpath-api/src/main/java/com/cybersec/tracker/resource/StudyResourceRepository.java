package com.cybersec.tracker.resource;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyResourceRepository extends JpaRepository<StudyResource, Long> {

    List<StudyResource> findByTopicIdOrderByIdAsc(Long topicId);
}
