package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Schedule;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule>, PagingAndSortingRepository<Schedule, Long> {
    List<Schedule> findByUserId(Long userId, Sort sort);
    Schedule findByUserIdAndDate(Long userId, LocalDate date);
    List<Schedule> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    @Query(
            value = "SELECT s.* FROM schedules s\n" +
                    "LEFT JOIN users u ON s.user_id = u.id\n" +
                    "WHERE u.user_role IN(:roles) AND s.date = :date", nativeQuery = true)
    List<Schedule> findAllByUserRoleAndDate(@Param(value = "roles") List<String> roles, @Param(value = "date") LocalDate date);
}
