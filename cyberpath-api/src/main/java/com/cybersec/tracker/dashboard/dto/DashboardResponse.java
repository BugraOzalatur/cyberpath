package com.cybersec.tracker.dashboard.dto;

import java.time.LocalDate;
import java.util.List;

public record DashboardResponse(
        int topicsTotal,
        int topicsCompleted,
        int topicsInProgress,
        int overallPercent,
        int minutesThisWeek,
        int minutesLastWeek,
        int streakDays,
        int tasksToday,
        int tasksOverdue,
        Integer quizAccuracy,
        int pendingReviews,
        List<TopicBrief> activeTopics,
        List<TopicBrief> reviewTopics,
        List<WeekStat> weeks,
        List<DayActivity> activity
) {

    public record TopicBrief(Long id, String title, int percent, Integer mastery) {
    }

    public record WeekStat(LocalDate weekStart, int minutes, int entries, int tasksDone) {
    }

    public record DayActivity(LocalDate date, int minutes) {
    }
}
