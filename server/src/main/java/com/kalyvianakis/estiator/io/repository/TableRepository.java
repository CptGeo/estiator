package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
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
            value = "SELECT DISTINCT tab.* FROM tables AS tab EXCEPT\n"
                    + "SELECT t.* FROM tables t\n"
                    + "INNER JOIN reservations r ON r.table_id = t.id\n"
                    + "WHERE r.`date` = ?1\n"
                    + "AND (\n"
                    + "    -- Case 1: New reservation fully overlaps an existing one\n"
                    + "    (TIME(?2) <= r.time \n"
                    + "    AND ADDTIME(TIME(?2), SEC_TO_TIME(?3)) >= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    \n"
                    + "    -- Case 2: New reservation ends inside an existing one\n"
                    + "    OR (ADDTIME(TIME(?2), SEC_TO_TIME(?3)) > r.time \n"
                    + "    AND ADDTIME(TIME(?2), SEC_TO_TIME(?3)) <= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    \n"
                    + "    -- Case 3: New reservation starts inside an existing one\n"
                    + "    OR (TIME(?2) >= r.time \n"
                    + "    AND TIME(?2) < ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + ")", nativeQuery = true)
    List<Table> getFreeByDateAndTimeAndDuration(LocalDate date, LocalTime time, Integer duration);

    @Query(
            value = "SELECT DISTINCT tab.* FROM tables AS tab EXCEPT\n"
                    + "SELECT t.* FROM tables t\n"
                    + "INNER JOIN reservations r ON r.table_id = t.id\n"
                    + "WHERE r.`date` = ?1 and r.status IN ?4 \n"
                    + "AND (\n"
                    + "    -- Case 1: New reservation fully overlaps an existing one\n"
                    + "    (TIME(?2) <= r.time \n"
                    + "    AND ADDTIME(TIME(?2), SEC_TO_TIME(?3)) >= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    \n"
                    + "    -- Case 2: New reservation ends inside an existing one\n"
                    + "    OR (ADDTIME(TIME(?2), SEC_TO_TIME(?3)) > r.time \n"
                    + "    AND ADDTIME(TIME(?2), SEC_TO_TIME(?3)) <= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    \n"
                    + "    -- Case 3: New reservation starts inside an existing one\n"
                    + "    OR (TIME(?2) >= r.time \n"
                    + "    AND TIME(?2) < ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + ")", nativeQuery = true)
    List<Table> getFreeByDateAndTimeAndDurationInStatus(LocalDate date, LocalTime time, Integer duration, List<ReservationStatus> status);
}
