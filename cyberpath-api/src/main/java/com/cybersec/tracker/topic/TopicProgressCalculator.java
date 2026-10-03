package com.cybersec.tracker.topic;

import com.cybersec.tracker.quiz.Attempt;
import com.cybersec.tracker.quiz.AttemptRepository;
import com.cybersec.tracker.quiz.Question;
import com.cybersec.tracker.quiz.QuestionRepository;
import com.cybersec.tracker.resource.StudyResource;
import com.cybersec.tracker.resource.StudyResourceRepository;
import com.cybersec.tracker.task.Task;
import com.cybersec.tracker.task.TaskRepository;
import com.cybersec.tracker.topic.dto.TopicProgress;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Calculates topic progress from resources, question results and tasks.
 * Data for all topics is loaded at once and grouped in memory (the number of topics is small).
 */
@Component
public class TopicProgressCalculator {

    static final int REVIEW_MASTERY_THRESHOLD = 70;
    static final int REVIEW_UNDERSTANDING_THRESHOLD = 2;

    private final StudyResourceRepository resourceRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final TaskRepository taskRepository;

    public TopicProgressCalculator(StudyResourceRepository resourceRepository, QuestionRepository questionRepository,
                                   AttemptRepository attemptRepository, TaskRepository taskRepository) {
        this.resourceRepository = resourceRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.taskRepository = taskRepository;
    }

    public Map<Long, TopicProgress> calculate(Collection<Topic> topics) {
        Map<Long, List<StudyResource>> resources = resourceRepository.findAll().stream()
                .collect(Collectors.groupingBy(StudyResource::getTopicId));
        Map<Long, List<Question>> questions = questionRepository.findAll().stream()
                .collect(Collectors.groupingBy(Question::getTopicId));
        Map<Long, Attempt> latestAttempts = attemptRepository.findLatestPerQuestion().stream()
                .collect(Collectors.toMap(Attempt::getQuestionId, Function.identity()));
        Map<Long, Long> openTasks = taskRepository.findByDoneFalse().stream()
                .filter(task -> task.getTopicId() != null)
                .collect(Collectors.groupingBy(Task::getTopicId, Collectors.counting()));

        return topics.stream().collect(Collectors.toMap(Topic::getId, topic -> progressOf(
                topic,
                resources.getOrDefault(topic.getId(), List.of()),
                questions.getOrDefault(topic.getId(), List.of()),
                latestAttempts,
                openTasks.getOrDefault(topic.getId(), 0L).intValue())));
    }

    static TopicProgress progressOf(Topic topic, List<StudyResource> resources, List<Question> questions,
                                    Map<Long, Attempt> latestAttempts, int openTasks) {
        int resourcesDone = (int) resources.stream().filter(StudyResource::isDone).count();
        List<Attempt> latest = questions.stream()
                .map(question -> latestAttempts.get(question.getId()))
                .filter(Objects::nonNull)
                .toList();
        int passed = (int) latest.stream().filter(attempt -> Boolean.TRUE.equals(attempt.getCorrect())).count();
        int pending = (int) latest.stream().filter(Attempt::isPending).count();
        Integer mastery = questions.isEmpty() ? null : Math.round(passed * 100f / questions.size());

        int percent = percent(topic.getStatus(), resourcesDone, resources.size(), passed, questions.size());
        boolean needsReview = topic.getStatus() == TopicStatus.COMPLETED
                && ((mastery != null && mastery < REVIEW_MASTERY_THRESHOLD)
                || (topic.getUnderstanding() != null && topic.getUnderstanding() <= REVIEW_UNDERSTANDING_THRESHOLD));

        return new TopicProgress(resourcesDone, resources.size(), passed, questions.size(), pending, openTasks,
                mastery, percent, needsReview);
    }

    private static int percent(TopicStatus status, int resourcesDone, int resourcesTotal, int passed,
                               int questionsTotal) {
        if (status == TopicStatus.COMPLETED) {
            return 100;
        }
        double sum = 0;
        int parts = 0;
        if (resourcesTotal > 0) {
            sum += (double) resourcesDone / resourcesTotal;
            parts++;
        }
        if (questionsTotal > 0) {
            sum += (double) passed / questionsTotal;
            parts++;
        }
        if (parts == 0) {
            return status == TopicStatus.IN_PROGRESS ? 10 : 0;
        }
        // Never show 100% until the topic is marked as completed
        return (int) Math.min(99, Math.round(sum / parts * 100));
    }
}
