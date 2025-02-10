package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
                    + "WHERE r.`date` = :date\n"
                    + "AND (\n"
                    + "    -- Case 1: New reservation fully overlaps an existing one\n"
                    + "    (TIME(:time) <= r.time \n"
                    + "    AND ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) >= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    -- Case 2: New reservation ends inside an existing one\n"
                    + "    OR (ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) > r.time \n"
                    + "    AND ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) <= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    -- Case 3: New reservation starts inside an existing one\n"
                    + "    OR (TIME(:time) >= r.time \n"
                    + "    AND TIME(:time) < ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + ")", nativeQuery = true)
    List<Table> getFreeByDateAndTimeAndDuration(
            @Param(value = "date") LocalDate date,
            @Param(value = "time") LocalTime time,
            @Param(value = "duration") Integer duration);

    @Query(
            value = "SELECT DISTINCT tab.* FROM tables AS tab EXCEPT\n"
                    + "SELECT t.* FROM tables t\n"
                    + "INNER JOIN reservations r ON r.table_id = t.id\n"
                    + "WHERE r.`date` = :date and r.status IN (:statuses) \n"
                    + "AND (\n"
                    + "    -- Case 1: New reservation fully overlaps an existing one\n"
                    + "    (TIME(:time) <= r.time \n"
                    + "    AND ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) >= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    -- Case 2: New reservation ends inside an existing one\n"
                    + "    OR (ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) > r.time \n"
                    + "    AND ADDTIME(TIME(:time), SEC_TO_TIME(:duration)) <= ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + "    -- Case 3: New reservation starts inside an existing one\n"
                    + "    OR (TIME(:time) >= r.time \n"
                    + "    AND TIME(:time) < ADDTIME(r.time, SEC_TO_TIME(r.duration)))\n"
                    + ")", nativeQuery = true)
    List<Table> getFreeByDateAndTimeAndDurationExcludeStatus(
            @Param(value = "date") LocalDate date,
            @Param(value = "time") LocalTime time,
            @Param(value = "duration") Integer duration,
            @Param(value= "statuses") List<Short> status
    );
}
