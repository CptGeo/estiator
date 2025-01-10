package com.kalyvianakis.estiator.io.model;
import com.kalyvianakis.estiator.io.enums.ScheduleStatus;
import org.springframework.format.annotation.DateTimeFormat;
import java.sql.Time;
import java.time.LocalDate;

/**
 * @implNote Serves as a @RequestBody model for POST `/users/{id}/schedules` endpoint
 */
public class ScheduleRequest {
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Time startTime;
    private Time endTime;

    private ScheduleStatus status;

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public ScheduleStatus getStatus() {
        return status;
    }

    public void setStatus(ScheduleStatus status) {
        this.status = status;
    }
}
