package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Schedule;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule>, PagingAndSortingRepository<Schedule, Long> {
    List<Schedule> findByUserId(Long userId, Sort sort);
    Schedule findByUserIdAndDate(Long userId, LocalDate date);
    List<Schedule> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
