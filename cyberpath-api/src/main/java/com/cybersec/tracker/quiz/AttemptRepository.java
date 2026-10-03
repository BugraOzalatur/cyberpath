package com.cybersec.tracker.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    /** The latest attempt for each question. */
    @Query("select a from Attempt a where a.id in (select max(b.id) from Attempt b group by b.questionId)")
    List<Attempt> findLatestPerQuestion();

    List<Attempt> findByCorrectIsNullOrderByCreatedAtAsc();

    List<Attempt> findByQuestionIdOrderByIdDesc(Long questionId);
}
