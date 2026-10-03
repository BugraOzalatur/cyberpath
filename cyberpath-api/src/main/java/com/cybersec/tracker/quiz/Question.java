package com.cybersec.tracker.quiz;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long topicId;

    @Column(nullable = false)
    private String prompt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionKind kind;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @OrderColumn(name = "position")
    @Column(name = "text", nullable = false)
    private List<String> options = new ArrayList<>();

    private Integer correctIndex;

    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionSource source;

    protected Question() {
    }

    public Question(Long topicId, String prompt, QuestionKind kind, List<String> options, Integer correctIndex,
                    String explanation, QuestionSource source) {
        this.topicId = topicId;
        this.prompt = prompt;
        this.kind = kind;
        this.options = new ArrayList<>(options);
        this.correctIndex = correctIndex;
        this.explanation = explanation;
        this.source = source;
    }

    public boolean isCorrectChoice(int selectedIndex) {
        return correctIndex != null && correctIndex == selectedIndex;
    }

    public Long getId() { return id; }
    public Long getTopicId() { return topicId; }
    public String getPrompt() { return prompt; }
    public QuestionKind getKind() { return kind; }
    public List<String> getOptions() { return options; }
    public Integer getCorrectIndex() { return correctIndex; }
    public String getExplanation() { return explanation; }
    public QuestionSource getSource() { return source; }
}
