package com.cybersec.tracker.dashboard;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class DashboardStreakTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 10, 2);

    @Test
    void countsConsecutiveDaysEndingToday() {
        Map<LocalDate, Integer> minutes = Map.of(TODAY, 30, TODAY.minusDays(1), 45, TODAY.minusDays(3), 60);
        assertThat(DashboardService.streak(minutes, TODAY)).isEqualTo(2);
    }

    @Test
    void keepsStreakWhenTodayNotLoggedYet() {
        Map<LocalDate, Integer> minutes = Map.of(TODAY.minusDays(1), 20, TODAY.minusDays(2), 20);
        assertThat(DashboardService.streak(minutes, TODAY)).isEqualTo(2);
    }

    @Test
    void zeroWhenNoRecentActivity() {
        assertThat(DashboardService.streak(Map.of(TODAY.minusDays(5), 10), TODAY)).isZero();
    }
}
