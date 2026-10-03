package com.cybersec.tracker.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTopicId(Long topicId);

    List<Task> findByDoneFalse();

    long countByDoneAtBetween(Instant from, Instant to);
}
