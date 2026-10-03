package com.cybersec.tracker.journal;

import com.cybersec.tracker.journal.dto.JournalRequest;
import com.cybersec.tracker.journal.dto.JournalResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @GetMapping
    public List<JournalResponse> list(@RequestParam(required = false) LocalDate from,
                                      @RequestParam(required = false) LocalDate to) {
        return journalService.list(from, to);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JournalResponse create(@Valid @RequestBody JournalRequest request) {
        return journalService.create(request);
    }

    @PutMapping("/{id}")
    public JournalResponse update(@PathVariable Long id, @Valid @RequestBody JournalRequest request) {
        return journalService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        journalService.delete(id);
    }
}
