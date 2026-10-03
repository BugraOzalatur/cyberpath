package com.cybersec.tracker.dashboard;

import com.cybersec.tracker.dashboard.dto.DashboardResponse;
import com.cybersec.tracker.dashboard.dto.DashboardResponse.DayActivity;
import com.cybersec.tracker.dashboard.dto.DashboardResponse.TopicBrief;
import com.cybersec.tracker.dashboard.dto.DashboardResponse.WeekStat;
import com.cybersec.tracker.journal.JournalEntry;
import com.cybersec.tracker.journal.JournalEntryRepository;
import com.cybersec.tracker.quiz.Attempt;
import com.cybersec.tracker.quiz.AttemptRepository;
import com.cybersec.tracker.task.Task;
import com.cybersec.tracker.task.TaskRepository;
import com.cybersec.tracker.topic.TopicService;
import com.cybersec.tracker.topic.TopicStatus;
import com.cybersec.tracker.topic.dto.TopicResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final int WEEKS = 8;
    private static final int ACTIVITY_DAYS = 84;

    private final TopicService topicService;
    private final JournalEntryRepository journalRepository;
    private final TaskRepository taskRepository;
    private final AttemptRepository attemptRepository;
    private final Clock clock;

    public DashboardService(TopicService topicService, JournalEntryRepository journalRepository,
                            TaskRepository taskRepository, AttemptRepository attemptRepository, Clock clock) {
        this.topicService = topicService;
        this.journalRepository = journalRepository;
        this.taskRepository = taskRepository;
        this.attemptRepository = attemptRepository;
        this.clock = clock;
    }

    public DashboardResponse build() {
        LocalDate today = LocalDate.now(clock);
        LocalDate thisWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate firstWeek = thisWeek.minusWeeks(WEEKS - 1);
        LocalDate activityStart = today.minusDays(ACTIVITY_DAYS - 1);
        LocalDate rangeStart = firstWeek.isBefore(activityStart) ? firstWeek : activityStart;

        List<TopicResponse> topics = topicService.list();
        List<JournalEntry> entries = journalRepository.findByEntryDateGreaterThanEqual(rangeStart);
        Map<LocalDate, Integer> minutesByDay = entries.stream()
                .collect(Collectors.groupingBy(JournalEntry::getEntryDate,
                        Collectors.summingInt(JournalEntry::getMinutes)));
        List<Task> tasks = taskRepository.findAll();

        int completed = count(topics, TopicStatus.COMPLETED);
        int inProgress = count(topics, TopicStatus.IN_PROGRESS);
        int overall = topics.isEmpty() ? 0
                : (int) Math.round(topics.stream().mapToInt(t -> t.progress().percent()).average().orElse(0));

        List<WeekStat> weeks = weekStats(firstWeek, entries, tasks);
        int minutesThisWeek = weeks.getLast().minutes();
        int minutesLastWeek = weeks.size() > 1 ? weeks.get(weeks.size() - 2).minutes() : 0;

        List<Attempt> latest = attemptRepository.findLatestPerQuestion();
        List<Attempt> graded = latest.stream().filter(a -> !a.isPending()).toList();
        Integer accuracy = graded.isEmpty() ? null
                : Math.round(graded.stream().filter(a -> Boolean.TRUE.equals(a.getCorrect())).count() * 100f / graded.size());
        int pendingReviews = attemptRepository.findByCorrectIsNullOrderByCreatedAtAsc().size();

        int tasksToday = (int) tasks.stream().filter(t -> !t.isDone() && today.equals(t.getDueDate())).count();
        int tasksOverdue = (int) tasks.stream()
                .filter(t -> !t.isDone() && t.getDueDate() != null && t.getDueDate().isBefore(today)).count();

        List<TopicBrief> active = topics.stream()
                .filter(t -> t.status() == TopicStatus.IN_PROGRESS)
                .map(DashboardService::brief).toList();
        List<TopicBrief> review = topics.stream()
                .filter(t -> t.progress().needsReview())
                .map(DashboardService::brief).toList();

        List<DayActivity> activity = new ArrayList<>(ACTIVITY_DAYS);
        for (LocalDate day = activityStart; !day.isAfter(today); day = day.plusDays(1)) {
            activity.add(new DayActivity(day, minutesByDay.getOrDefault(day, 0)));
        }

        return new DashboardResponse(topics.size(), completed, inProgress, overall, minutesThisWeek, minutesLastWeek,
                streak(minutesByDay, today), tasksToday, tasksOverdue, accuracy, pendingReviews, active, review,
                weeks, activity);
    }

    private List<WeekStat> weekStats(LocalDate firstWeek, List<JournalEntry> entries, List<Task> tasks) {
        List<WeekStat> weeks = new ArrayList<>(WEEKS);
        for (int i = 0; i < WEEKS; i++) {
            LocalDate start = firstWeek.plusWeeks(i);
            LocalDate end = start.plusDays(6);
            List<JournalEntry> inWeek = entries.stream()
                    .filter(e -> !e.getEntryDate().isBefore(start) && !e.getEntryDate().isAfter(end))
                    .toList();
            int tasksDone = (int) tasks.stream()
                    .filter(t -> t.getDoneAt() != null)
                    .map(t -> LocalDate.ofInstant(t.getDoneAt(), clock.getZone()))
                    .filter(d -> !d.isBefore(start) && !d.isAfter(end))
                    .count();
            weeks.add(new WeekStat(start, inWeek.stream().mapToInt(JournalEntry::getMinutes).sum(), inWeek.size(),
                    tasksDone));
        }
        return weeks;
    }

    /** Number of consecutive study days counting back from today (or from yesterday if nothing is logged today yet). */
    static int streak(Map<LocalDate, Integer> minutesByDay, LocalDate today) {
        LocalDate day = minutesByDay.getOrDefault(today, 0) > 0 ? today : today.minusDays(1);
        int streak = 0;
        while (minutesByDay.getOrDefault(day, 0) > 0) {
            streak++;
            day = day.minusDays(1);
        }
        return streak;
    }

    private static int count(List<TopicResponse> topics, TopicStatus status) {
        return (int) topics.stream().filter(t -> t.status() == status).count();
    }

    private static TopicBrief brief(TopicResponse topic) {
        return new TopicBrief(topic.id(), topic.title(), topic.progress().percent(), topic.progress().mastery());
    }
}
