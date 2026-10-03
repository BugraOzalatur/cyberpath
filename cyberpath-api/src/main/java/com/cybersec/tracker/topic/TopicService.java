package com.cybersec.tracker.topic;

import com.cybersec.tracker.shared.exception.NotFoundException;
import com.cybersec.tracker.topic.dto.CreateTopicRequest;
import com.cybersec.tracker.topic.dto.TopicProgress;
import com.cybersec.tracker.topic.dto.TopicResponse;
import com.cybersec.tracker.topic.dto.UpdateTopicRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@Transactional
public class TopicService {

    private static final int MAX_SLUG_LENGTH = 60;

    /** Lower-case letters that NFD does not reduce to ASCII, written as escapes to keep the source ASCII-only. */
    private static final Map<String, String> UNDECOMPOSABLE_LETTERS = Map.of(
            "\u0131", "i",   // dotless i (Turkish, Azerbaijani)
            "\u00df", "ss",  // sharp s (German)
            "\u00e6", "ae",  // ae ligature (Danish, Norwegian)
            "\u00f8", "o",   // o with stroke (Danish, Norwegian)
            "\u0142", "l",   // l with stroke (Polish)
            "\u0111", "d",   // d with stroke (Croatian, Vietnamese)
            "\u0153", "oe",  // oe ligature (French)
            "\u00fe", "th",  // thorn (Icelandic)
            "\u00f0", "d"    // eth (Icelandic)
    );

    private final TopicRepository topicRepository;
    private final TopicProgressCalculator progressCalculator;

    public TopicService(TopicRepository topicRepository, TopicProgressCalculator progressCalculator) {
        this.topicRepository = topicRepository;
        this.progressCalculator = progressCalculator;
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> list() {
        List<Topic> topics = topicRepository.findAllByOrderByOrderIndexAsc();
        Map<Long, TopicProgress> progress = progressCalculator.calculate(topics);
        return topics.stream().map(topic -> toResponse(topic, progress.get(topic.getId()))).toList();
    }

    @Transactional(readOnly = true)
    public TopicResponse get(Long id) {
        Topic topic = find(id);
        return toResponse(topic, progressCalculator.calculate(List.of(topic)).get(id));
    }

    public TopicResponse create(CreateTopicRequest request) {
        int nextOrder = topicRepository.findAllByOrderByOrderIndexAsc().stream()
                .mapToInt(Topic::getOrderIndex).max().orElse(0) + 1;
        Topic topic = new Topic(uniqueSlug(request.title()), request.title(), request.category(), request.summary(),
                nextOrder);
        topic = topicRepository.save(topic);
        return get(topic.getId());
    }

    public TopicResponse update(Long id, UpdateTopicRequest request) {
        Topic topic = find(id);
        if (request.title() != null) topic.setTitle(request.title());
        if (request.category() != null) topic.setCategory(request.category());
        if (request.summary() != null) topic.setSummary(request.summary());
        if (request.status() != null) topic.changeStatus(request.status());
        if (request.understanding() != null) topic.setUnderstanding(request.understanding());
        if (request.notes() != null) topic.setNotes(request.notes());
        topicRepository.flush();
        return get(id);
    }

    public void delete(Long id) {
        topicRepository.delete(find(id));
    }

    private Topic find(Long id) {
        return topicRepository.findById(id).orElseThrow(() -> new NotFoundException("Topic", id));
    }

    private String uniqueSlug(String title) {
        String base = slugify(title);
        String slug = base;
        int suffix = 2;
        while (topicRepository.existsBySlug(slug)) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }

    /**
     * Turns a title in any Latin-script language into a URL-friendly slug, e.g. "Web Security & OWASP" -> "web-security-owasp".
     * Accents are removed by Unicode decomposition (NFD); the letters below have no decomposition and are mapped
     * explicitly. Titles without any Latin letters fall back to "topic" (uniqueSlug then adds a suffix).
     */
    static String slugify(String title) {
        String lower = title.toLowerCase(Locale.ROOT);
        for (Map.Entry<String, String> letter : UNDECOMPOSABLE_LETTERS.entrySet()) {
            lower = lower.replace(letter.getKey(), letter.getValue());
        }
        String ascii = Normalizer.normalize(lower, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String slug = ascii.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        if (slug.length() > MAX_SLUG_LENGTH) {
            // Cutting may end on a separator; never leave a trailing hyphen
            slug = slug.substring(0, MAX_SLUG_LENGTH).replaceAll("-+$", "");
        }
        return slug.isEmpty() ? "topic" : slug;
    }

    private static TopicResponse toResponse(Topic topic, TopicProgress progress) {
        return new TopicResponse(topic.getId(), topic.getSlug(), topic.getTitle(), topic.getCategory(),
                topic.getSummary(), topic.getOrderIndex(), topic.getStatus(), topic.getUnderstanding(),
                topic.getNotes(), topic.getStartedAt(), topic.getCompletedAt(), progress);
    }
}
