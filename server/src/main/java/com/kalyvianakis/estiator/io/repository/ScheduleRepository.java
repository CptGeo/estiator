package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Schedule;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer>, JpaSpecificationExecutor<Schedule>, PagingAndSortingRepository<Schedule, Integer> {
    List<Schedule> findByUserId(Integer userId, Sort sort);
    Schedule findByUserIdAndDate(Integer userId, LocalDate date);

//    @Query("SELECT * FROM schedule s WHERE (s.date BETWEEN '2025-01-01' AND '2025-05-01') AND user_id = 1")
//    List<Schedule> findByUserIdAndDateRange(Integer userId, Date startDate, Date endDate);
    List<Schedule> findByUserIdAndDateBetween(Integer userId, LocalDate startDate, LocalDate endDate);

//    List<Schedule> saveAll
}
