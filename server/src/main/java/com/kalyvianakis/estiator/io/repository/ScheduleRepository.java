package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Schedule;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer>, JpaSpecificationExecutor<Schedule>, PagingAndSortingRepository<Schedule, Integer> {
    List<Schedule> findByUserId(Integer userId, Sort sort);
}
