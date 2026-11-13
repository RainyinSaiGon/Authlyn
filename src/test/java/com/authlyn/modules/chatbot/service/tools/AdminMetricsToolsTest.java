package com.authlyn.modules.chatbot.service.tools;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminMetricsToolsTest {

    @Mock
    private UserJpaRepository users;

    @Mock
    private SessionJpaRepository sessions;

    @InjectMocks
    private AdminMetricsTools tools;

    @Test
    void testCountRecentSignupsReturnsDelegatedCount() {
        when(users.countByCreatedAtAfter(any(Instant.class))).thenReturn(42L);

        assertThat(tools.countRecentSignups(7)).isEqualTo(42L);
    }

    @Test
    void testCountRecentSignupsRejectsOutOfRangeDays() {
        assertThatThrownBy(() -> tools.countRecentSignups(0))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> tools.countRecentSignups(91))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void testCountActiveSessionsDelegatesWithCurrentTime() {
        when(sessions.countActive(any(Instant.class))).thenReturn(15L);

        assertThat(tools.countActiveSessions()).isEqualTo(15L);
    }

    @Test
    void testRecentSignupsByDayMapsDatabaseRows() {
        Object[] row = new Object[]{"2026-05-20", 5L};
        List<Object[]> rows = new java.util.ArrayList<>();
        rows.add(row);
        when(users.countByDaySince(any(Instant.class))).thenReturn(rows);

        var result = tools.recentSignupsByDay(7);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).date()).isEqualTo("2026-05-20");
        assertThat(result.get(0).count()).isEqualTo(5L);
    }

    @Test
    void testRecentSignupsByDayRejectsOutOfRangeDays() {
        assertThatThrownBy(() -> tools.recentSignupsByDay(0))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> tools.recentSignupsByDay(31))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
