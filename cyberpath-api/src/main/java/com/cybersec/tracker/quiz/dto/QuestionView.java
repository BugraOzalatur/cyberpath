package com.cybersec.tracker.quiz.dto;

import com.cybersec.tracker.quiz.Question;
import com.cybersec.tracker.quiz.QuestionKind;
import com.cybersec.tracker.quiz.QuestionSource;

import java.util.List;

/**
 * A question as shown to the learner. The correct answer and explanation are only returned once the question has been answered at least once.
 */
public record QuestionView(Long id, Long topicId, String prompt, QuestionKind kind, List<String> options,
                           QuestionSource source, LastAttempt lastAttempt, Integer correctIndex,
                           String explanation) {

    public static QuestionView from(Question question, LastAttempt lastAttempt) {
        boolean reveal = lastAttempt != null;
        return new QuestionView(question.getId(), question.getTopicId(), question.getPrompt(), question.getKind(),
                List.copyOf(question.getOptions()), question.getSource(), lastAttempt,
                reveal ? question.getCorrectIndex() : null,
                reveal ? question.getExplanation() : null);
    }
}
