package com.cybersec.tracker.topic;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findAllByOrderByOrderIndexAsc();

    boolean existsBySlug(String slug);

    long countByStatus(TopicStatus status);
}
