package com.cybersec.tracker.quiz;

import com.cybersec.tracker.quiz.dto.AnswerRequest;
import com.cybersec.tracker.quiz.dto.AnswerResult;
import com.cybersec.tracker.quiz.dto.GradeRequest;
import com.cybersec.tracker.quiz.dto.LastAttempt;
import com.cybersec.tracker.quiz.dto.PendingReview;
import com.cybersec.tracker.quiz.dto.QuestionRequest;
import com.cybersec.tracker.quiz.dto.QuestionView;
import com.cybersec.tracker.shared.exception.BadRequestException;
import com.cybersec.tracker.shared.exception.NotFoundException;
import com.cybersec.tracker.topic.Topic;
import com.cybersec.tracker.topic.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {

    private static final int MIN_OPTIONS = 2;
    private static final int MAX_OPTIONS = 6;
    private static final int MAX_EXAM_SIZE = 50;

    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final TopicRepository topicRepository;

    public QuizService(QuestionRepository questionRepository, AttemptRepository attemptRepository,
                       TopicRepository topicRepository) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.topicRepository = topicRepository;
    }

    @Transactional(readOnly = true)
    public List<QuestionView> listForTopic(Long topicId) {
        Map<Long, Attempt> latest = latestAttemptsByQuestion();
        return questionRepository.findByTopicIdOrderByIdAsc(topicId).stream()
                .map(question -> toView(question, latest.get(question.getId())))
                .toList();
    }

    public QuestionView create(Long topicId, QuestionRequest request) {
        if (!topicRepository.existsById(topicId)) {
            throw new NotFoundException("Topic", topicId);
        }
        List<String> options = request.options() == null ? List.of() : request.options();
        if (request.kind() == QuestionKind.MULTIPLE_CHOICE) {
            if (options.size() < MIN_OPTIONS || options.size() > MAX_OPTIONS) {
                throw new BadRequestException("A multiple-choice question needs " + MIN_OPTIONS + "-" + MAX_OPTIONS + " options");
            }
            if (request.correctIndex() == null || request.correctIndex() < 0 || request.correctIndex() >= options.size()) {
                throw new BadRequestException("correctIndex must point to one of the options");
            }
        } else {
            options = List.of();
        }
        QuestionSource source = request.source() != null ? request.source() : QuestionSource.MANUAL;
        Integer correctIndex = request.kind() == QuestionKind.MULTIPLE_CHOICE ? request.correctIndex() : null;
        Question question = questionRepository.save(new Question(topicId, request.prompt(), request.kind(), options,
                correctIndex, request.explanation(), source));
        return toView(question, null);
    }

    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new NotFoundException("Question", id);
        }
        questionRepository.deleteById(id);
    }

    public AnswerResult answer(Long questionId, AnswerRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question", questionId));
        Attempt attempt;
        if (question.getKind() == QuestionKind.MULTIPLE_CHOICE) {
            Integer selected = request.selectedIndex();
            if (selected == null || selected >= question.getOptions().size()) {
                throw new BadRequestException("Select a valid option");
            }
            attempt = Attempt.choice(questionId, selected, question.isCorrectChoice(selected));
        } else {
            if (request.answerText() == null || request.answerText().isBlank()) {
                throw new BadRequestException("The answer must not be empty");
            }
            attempt = Attempt.openAnswer(questionId, request.answerText().strip());
        }
        attempt = attemptRepository.save(attempt);
        return new AnswerResult(attempt.getId(), attempt.getCorrect(), attempt.isPending(),
                question.getCorrectIndex(), question.getExplanation());
    }

    @Transactional(readOnly = true)
    public List<PendingReview> pendingReviews() {
        List<Attempt> pending = attemptRepository.findByCorrectIsNullOrderByCreatedAtAsc();
        Map<Long, Question> questions = questionRepository.findAllById(
                        pending.stream().map(Attempt::getQuestionId).distinct().toList()).stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));
        Map<Long, String> topicTitles = topicRepository.findAll().stream()
                .collect(Collectors.toMap(Topic::getId, Topic::getTitle));
        return pending.stream()
                .map(attempt -> {
                    Question question = questions.get(attempt.getQuestionId());
                    return new PendingReview(attempt.getId(), question.getId(), question.getTopicId(),
                            topicTitles.get(question.getTopicId()), question.getPrompt(), question.getExplanation(),
                            attempt.getAnswerText(), attempt.getCreatedAt());
                })
                .toList();
    }

    public LastAttempt grade(Long attemptId, GradeRequest request) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new NotFoundException("Attempt", attemptId));
        if (attempt.getAnswerText() == null) {
            throw new BadRequestException("Multiple-choice answers are graded automatically");
        }
        attempt.grade(request.correct(), request.feedback());
        return LastAttempt.from(attempt);
    }

    /** Random multiple-choice questions from the given topics (all topics if empty). Answers are submitted one by one. */
    @Transactional(readOnly = true)
    public List<QuestionView> exam(List<Long> topicIds, int size) {
        if (size < 1 || size > MAX_EXAM_SIZE) {
            throw new BadRequestException("Number of questions must be between 1 and " + MAX_EXAM_SIZE);
        }
        List<Question> pool = new ArrayList<>(topicIds == null || topicIds.isEmpty()
                ? questionRepository.findByKind(QuestionKind.MULTIPLE_CHOICE)
                : questionRepository.findByKindAndTopicIdIn(QuestionKind.MULTIPLE_CHOICE, topicIds));
        Collections.shuffle(pool);
        return pool.stream()
                .limit(size)
                .map(question -> QuestionView.from(question, null))
                .toList();
    }

    private Map<Long, Attempt> latestAttemptsByQuestion() {
        return attemptRepository.findLatestPerQuestion().stream()
                .collect(Collectors.toMap(Attempt::getQuestionId, Function.identity()));
    }

    private static QuestionView toView(Question question, Attempt latest) {
        return QuestionView.from(question, latest == null ? null : LastAttempt.from(latest));
    }
}
