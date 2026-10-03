package com.cybersec.tracker.topic;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** Non-ASCII inputs are written as Unicode escapes so the source stays ASCII-only; the comment shows the text. */
class TopicServiceSlugTest {

    @ParameterizedTest(name = "{2}")
    @CsvSource(delimiter = '|', value = {
            "Intro to Linux: Permissions & SUID | intro-to-linux-permissions-suid | English",
            "A\u011f G\u00fcvenli\u011fi & \u0130zleme | ag-guvenligi-izleme | Turkish: Ag Guvenligi & Izleme with dotted capital I",
            "\u0131\u015f\u0131k I\u015eIK | isik-isik | Turkish dotless i in lower and upper case",
            "Caf\u00e9 R\u00e9sum\u00e9 na\u00efve | cafe-resume-naive | French accents (decomposed by NFD)",
            "Stra\u00dfe \u00d8resund \u0141\u00f3d\u017a \u00c6ther | strasse-oresund-lodz-aether | Letters NFD cannot decompose: sharp s, o-stroke, l-stroke, ae",
            "--- Web   Security!!! --- | web-security | Separators collapse and edges are trimmed",
    })
    void slugifiesTitlesInLatinScripts(String title, String expected, String description) {
        assertThat(TopicService.slugify(title)).isEqualTo(expected);
    }

    @Test
    void truncatesWithoutTrailingHyphen() {
        String slug = TopicService.slugify("Understanding Cross Site Request Forgery Defenses In Spring Boot Apps");
        assertThat(slug).isEqualTo("understanding-cross-site-request-forgery-defenses-in-spring").hasSizeLessThanOrEqualTo(60);
    }

    @Test
    void fallsBackWhenNoLatinLettersRemain() {
        assertThat(TopicService.slugify("!!!")).isEqualTo("topic");
        // Cyrillic: "Setevaya bezopasnost" (network security)
        assertThat(TopicService.slugify("\u0421\u0435\u0442\u0435\u0432\u0430\u044f \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c")).isEqualTo("topic");
    }
}
