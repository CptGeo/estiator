package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kalyvianakis.estiator.io.model.Reservation;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Long countByDateLessThanEqual(LocalDate date);
    Long countByDateBetween(LocalDate from, LocalDate to);

    @Query(
            value = "SELECT\n" +
                    "    COUNT(*)\n" +
                    "FROM\n" +
                    "    reservations r2\n" +
                    "WHERE\n" +
                    "    (ISNULL (:id) OR (:id != r2.id))\n" +
                    "    AND :date = r2.date\n" +
                    "    AND :tableId = r2.table_id\n" +
                    "    AND (\n" +
                    "        -- Case 1: New reservation fully overlaps an existing one\n" +
                    "        (\n" +
                    "            TIME(r2.time) <= TIME(:time)\n" +
                    "            AND ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) >= ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        ) -- Case 2: New reservation ends inside an existing one\n" +
                    "        OR (\n" +
                    "            ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) >= TIME(:time)\n" +
                    "            AND ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) <= ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        ) -- Case 3: New reservation starts inside an existing one\n" +
                    "        OR (\n" +
                    "            TIME(r2.time) >= TIME(:time)\n" +
                    "            AND TIME(r2.time) < ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        )\n" +
                    "    )",
            nativeQuery = true)
    Integer countConflicts(
            @Param(value = "id") Long id,
            @Param(value = "date") LocalDate date,
            @Param(value = "time") LocalTime time,
            @Param(value = "duration") Integer duration,
            @Param(value= "tableId") Long tableId);

    @Query(
            value = "SELECT\n" +
                    "    COUNT(*)\n" +
                    "FROM\n" +
                    "    reservations r2\n" +
                    "WHERE\n" +
                    "    :id != r2.id\n" +
                    "    AND :date = r2.date" +
                    "    AND r2.status IN (:includeStatuses)\n" +
                    "    AND :tableId = r2.table_id\n" +
                    "    AND (\n" +
                    "        -- Case 1: New reservation fully overlaps an existing one\n" +
                    "        (\n" +
                    "            TIME(r2.time) <= TIME(:time)\n" +
                    "            AND ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) >= ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        ) -- Case 2: New reservation ends inside an existing one\n" +
                    "        OR (\n" +
                    "            ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) > TIME(:time)\n" +
                    "            AND ADDTIME(TIME(r2.time), SEC_TO_TIME(r2.duration)) <= ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        ) -- Case 3: New reservation starts inside an existing one\n" +
                    "        OR (\n" +
                    "            TIME(r2.time) >= TIME(:time)\n" +
                    "            AND TIME(r2.time) < ADDTIME(:time, SEC_TO_TIME(:duration))\n" +
                    "        )\n" +
                    "    )",
            nativeQuery = true)
    Integer countConflictsIncludeStatuses(
            @Param(value = "id") Long id,
            @Param(value = "date") LocalDate date,
            @Param(value = "time") LocalTime time,
            @Param(value = "duration") Integer duration,
            @Param(value= "tableId") Long tableId,
            @Param(value = "includeStatuses") List<Short> includeStatuses);
}