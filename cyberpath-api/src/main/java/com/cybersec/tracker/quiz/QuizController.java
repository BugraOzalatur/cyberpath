package com.cybersec.tracker.quiz;

import com.cybersec.tracker.quiz.dto.AnswerRequest;
import com.cybersec.tracker.quiz.dto.AnswerResult;
import com.cybersec.tracker.quiz.dto.GradeRequest;
import com.cybersec.tracker.quiz.dto.LastAttempt;
import com.cybersec.tracker.quiz.dto.PendingReview;
import com.cybersec.tracker.quiz.dto.QuestionRequest;
import com.cybersec.tracker.quiz.dto.QuestionView;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/topics/{topicId}/questions")
    public List<QuestionView> list(@PathVariable Long topicId) {
        return quizService.listForTopic(topicId);
    }

    @PostMapping("/topics/{topicId}/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionView create(@PathVariable Long topicId, @Valid @RequestBody QuestionRequest request) {
        return quizService.create(topicId, request);
    }

    @DeleteMapping("/questions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        quizService.deleteQuestion(id);
    }

    @PostMapping("/questions/{id}/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public AnswerResult answer(@PathVariable Long id, @Valid @RequestBody AnswerRequest request) {
        return quizService.answer(id, request);
    }

    @GetMapping("/attempts/pending")
    public List<PendingReview> pending() {
        return quizService.pendingReviews();
    }

    @PatchMapping("/attempts/{id}/grade")
    public LastAttempt grade(@PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        return quizService.grade(id, request);
    }

    @GetMapping("/quiz/exam")
    public List<QuestionView> exam(@RequestParam(required = false) List<Long> topicIds,
                                   @RequestParam(defaultValue = "10") int size) {
        return quizService.exam(topicIds, size);
    }
}
