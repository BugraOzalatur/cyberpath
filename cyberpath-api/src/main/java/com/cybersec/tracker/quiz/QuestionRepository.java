package com.cybersec.tracker.quiz;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTopicIdOrderByIdAsc(Long topicId);

    List<Question> findByKindAndTopicIdIn(QuestionKind kind, Collection<Long> topicIds);

    List<Question> findByKind(QuestionKind kind);
}
