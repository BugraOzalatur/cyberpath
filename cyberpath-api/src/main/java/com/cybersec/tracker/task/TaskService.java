package com.cybersec.tracker.task;

import com.cybersec.tracker.shared.exception.NotFoundException;
import com.cybersec.tracker.task.dto.TaskRequest;
import com.cybersec.tracker.task.dto.TaskResponse;
import com.cybersec.tracker.task.dto.UpdateTaskRequest;
import com.cybersec.tracker.topic.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

@Service
@Transactional
public class TaskService {

    private static final Comparator<Task> TASK_ORDER = Comparator
            .comparing(Task::isDone)
            .thenComparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(Task::getCreatedAt);

    private final TaskRepository taskRepository;
    private final TopicRepository topicRepository;
    private final Clock clock;

    public TaskService(TaskRepository taskRepository, TopicRepository topicRepository, Clock clock) {
        this.taskRepository = taskRepository;
        this.topicRepository = topicRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> list(TaskScope scope, Long topicId) {
        LocalDate today = LocalDate.now(clock);
        List<Task> source = topicId != null ? taskRepository.findByTopicId(topicId) : taskRepository.findAll();
        return source.stream()
                .filter(scopeFilter(scope, today))
                .sorted(TASK_ORDER)
                .map(task -> TaskResponse.from(task, today))
                .toList();
    }

    public TaskResponse create(TaskRequest request) {
        requireTopic(request.topicId());
        Task task = taskRepository.save(new Task(request.topicId(), request.title(), request.dueDate()));
        return TaskResponse.from(task, LocalDate.now(clock));
    }

    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task", id));
        if (request.title() != null) task.setTitle(request.title());
        if (request.topicId() != null) {
            requireTopic(request.topicId());
            task.setTopicId(request.topicId());
        }
        if (Boolean.TRUE.equals(request.clearDueDate())) {
            task.setDueDate(null);
        } else if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.done() != null) task.markDone(request.done());
        return TaskResponse.from(task, LocalDate.now(clock));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new NotFoundException("Task", id);
        }
        taskRepository.deleteById(id);
    }

    private void requireTopic(Long topicId) {
        if (topicId != null && !topicRepository.existsById(topicId)) {
            throw new NotFoundException("Topic", topicId);
        }
    }

    private static Predicate<Task> scopeFilter(TaskScope scope, LocalDate today) {
        if (scope == TaskScope.ALL) {
            return task -> true;
        }
        LocalDate end = scope == TaskScope.TODAY ? today : today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        LocalDate start = scope == TaskScope.TODAY ? today : today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        return task -> {
            LocalDate due = task.getDueDate();
            if (due == null) {
                return false;
            }
            boolean overdue = !task.isDone() && due.isBefore(today);
            return overdue || (!due.isBefore(start) && !due.isAfter(end));
        };
    }
}
