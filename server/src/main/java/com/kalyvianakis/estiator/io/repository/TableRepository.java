package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    @Query(value = "SELECT SUM(capacity) FROM Tables", nativeQuery = true)
    Long getTotalCapacity();

    @Query(
        value = "SELECT DISTINCT tab.* FROM Tables AS tab EXCEPT\n"
            + "     SELECT t.* from Tables AS t\n"
            + "       INNER JOIN reservations AS r ON r.table_id = t.id\n"
            + "     WHERE `date` = ?1\n"
            + "         AND (TIME(?2) BETWEEN r.time AND (ADDDATE(r.`time`, INTERVAL r.duration SECOND) - 1))\n"
            + "         OR  ADDDATE(TIME(?2), INTERVAL ?3 SECOND) BETWEEN r.time + 1 AND ADDDATE(r.`time`, INTERVAL r.duration SECOND)", nativeQuery = true)
    List<Table> getIdsFreeByDateAndTimeAndDuration(LocalDate date, LocalTime time, Integer duration);
}
