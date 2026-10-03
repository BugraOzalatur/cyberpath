package com.cybersec.tracker.task;

public enum TaskScope {
    /** Tasks due today + overdue open tasks. */
    TODAY,
    /** Tasks due this week (Mon-Sun) + overdue open tasks. */
    WEEK,
    ALL
}
