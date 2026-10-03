package com.cybersec.tracker.journal;

import com.cybersec.tracker.journal.dto.JournalRequest;
import com.cybersec.tracker.journal.dto.JournalResponse;
import com.cybersec.tracker.shared.exception.BadRequestException;
import com.cybersec.tracker.shared.exception.NotFoundException;
import com.cybersec.tracker.topic.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class JournalService {

    private static final int DEFAULT_RANGE_DAYS = 30;

    private final JournalEntryRepository journalRepository;
    private final TopicRepository topicRepository;
    private final Clock clock;

    public JournalService(JournalEntryRepository journalRepository, TopicRepository topicRepository, Clock clock) {
        this.journalRepository = journalRepository;
        this.topicRepository = topicRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<JournalResponse> list(LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now(clock);
        LocalDate start = from != null ? from : end.minusDays(DEFAULT_RANGE_DAYS);
        if (start.isAfter(end)) {
            throw new BadRequestException("'from' must not be after 'to'");
        }
        return journalRepository.findByEntryDateBetweenOrderByEntryDateDescIdDesc(start, end).stream()
                .map(JournalResponse::from)
                .toList();
    }

    public JournalResponse create(JournalRequest request) {
        JournalEntry entry = new JournalEntry(request.entryDate());
        apply(entry, request);
        return JournalResponse.from(journalRepository.save(entry));
    }

    public JournalResponse update(Long id, JournalRequest request) {
        JournalEntry entry = journalRepository.findById(id).orElseThrow(() -> new NotFoundException("Journal entry", id));
        apply(entry, request);
        return JournalResponse.from(entry);
    }

    public void delete(Long id) {
        if (!journalRepository.existsById(id)) {
            throw new NotFoundException("Journal entry", id);
        }
        journalRepository.deleteById(id);
    }

    private void apply(JournalEntry entry, JournalRequest request) {
        if (request.topicId() != null && !topicRepository.existsById(request.topicId())) {
            throw new NotFoundException("Topic", request.topicId());
        }
        entry.setEntryDate(request.entryDate());
        entry.setMinutes(request.minutes());
        entry.setSummary(request.summary());
        entry.setStruggles(request.struggles());
        entry.setNextGoal(request.nextGoal());
        entry.setTopicId(request.topicId());
    }
}
