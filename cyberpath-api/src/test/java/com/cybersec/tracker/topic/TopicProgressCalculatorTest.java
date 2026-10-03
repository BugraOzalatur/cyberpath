package com.cybersec.tracker.topic;

import com.cybersec.tracker.quiz.Attempt;
import com.cybersec.tracker.quiz.Question;
import com.cybersec.tracker.quiz.QuestionKind;
import com.cybersec.tracker.quiz.QuestionSource;
import com.cybersec.tracker.resource.ResourceKind;
import com.cybersec.tracker.resource.StudyResource;
import com.cybersec.tracker.topic.dto.TopicProgress;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class TopicProgressCalculatorTest {

    @Test
    void averagesResourceAndQuestionProgress() {
        Topic topic = topic(TopicStatus.IN_PROGRESS);
        StudyResource done = resource(true);
        StudyResource notDone = resource(false);
        Question q1 = question(1L);
        Question q2 = question(2L);
        Map<Long, Attempt> attempts = Map.of(1L, Attempt.choice(1L, 0, true));

        TopicProgress progress = TopicProgressCalculator.progressOf(topic, List.of(done, notDone), List.of(q1, q2),
                attempts, 3);

        assertThat(progress.percent()).isEqualTo(50);
        assertThat(progress.mastery()).isEqualTo(50);
        assertThat(progress.questionsPassed()).isEqualTo(1);
        assertThat(progress.openTasks()).isEqualTo(3);
        assertThat(progress.needsReview()).isFalse();
    }

    @Test
    void neverShowsFullProgressUntilCompleted() {
        Topic topic = topic(TopicStatus.IN_PROGRESS);
        TopicProgress progress = TopicProgressCalculator.progressOf(topic, List.of(resource(true)), List.of(),
                Map.of(), 0);

        assertThat(progress.percent()).isEqualTo(99);
    }

    @Test
    void flagsCompletedTopicWithLowMasteryForReview() {
        Topic topic = topic(TopicStatus.COMPLETED);
        Question q1 = question(1L);
        Map<Long, Attempt> attempts = Map.of(1L, Attempt.choice(1L, 2, false));

        TopicProgress progress = TopicProgressCalculator.progressOf(topic, List.of(), List.of(q1), attempts, 0);

        assertThat(progress.percent()).isEqualTo(100);
        assertThat(progress.mastery()).isZero();
        assertThat(progress.needsReview()).isTrue();
    }

    @Test
    void countsPendingOpenAnswersSeparately() {
        Topic topic = topic(TopicStatus.IN_PROGRESS);
        Question open = question(5L);
        Map<Long, Attempt> attempts = Map.of(5L, Attempt.openAnswer(5L, "my answer"));

        TopicProgress progress = TopicProgressCalculator.progressOf(topic, List.of(), List.of(open), attempts, 0);

        assertThat(progress.pendingReviews()).isEqualTo(1);
        assertThat(progress.questionsPassed()).isZero();
    }

    private static Topic topic(TopicStatus status) {
        Topic topic = new Topic("t", "Test", TopicCategory.FUNDAMENTALS, null, 1);
        topic.changeStatus(status);
        return topic;
    }

    private static StudyResource resource(boolean done) {
        StudyResource resource = new StudyResource(1L, "r", null, ResourceKind.DOC);
        resource.setDone(done);
        return resource;
    }

    private static Question question(Long id) {
        Question question = new Question(1L, "?", QuestionKind.MULTIPLE_CHOICE, List.of("a", "b", "c"), 0, null,
                QuestionSource.SEED);
        ReflectionTestUtils.setField(question, "id", id);
        return question;
    }
}
