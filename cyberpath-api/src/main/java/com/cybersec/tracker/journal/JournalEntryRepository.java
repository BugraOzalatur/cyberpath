package com.cybersec.tracker.journal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    List<JournalEntry> findByEntryDateBetweenOrderByEntryDateDescIdDesc(LocalDate from, LocalDate to);

    List<JournalEntry> findByEntryDateGreaterThanEqual(LocalDate from);
}
