package com.cybersec.tracker.journal.dto;

import com.cybersec.tracker.journal.JournalEntry;

import java.time.LocalDate;

public record JournalResponse(Long id, LocalDate entryDate, int minutes, String summary, String struggles,
                              String nextGoal, Long topicId) {

    public static JournalResponse from(JournalEntry entry) {
        return new JournalResponse(entry.getId(), entry.getEntryDate(), entry.getMinutes(), entry.getSummary(),
                entry.getStruggles(), entry.getNextGoal(), entry.getTopicId());
    }
}
