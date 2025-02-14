package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kalyvianakis.estiator.io.enums.ScheduleStatus;
import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Time;
import java.time.LocalDate;

@Entity
@Table(name = "schedules", uniqueConstraints = @UniqueConstraint(name = "UniqueUserAndDate", columnNames = { "user_id", "date" }))
public class Schedule extends PropertyPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties(value = { "tables", "reservations", "createdReservations", "referredReservations", "schedules" })
    @JsonProperty(value = "user")
    private User user;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private Time startTime;

    private Time endTime;

    @Transient
    @NotNull(message = "Schedule status must not be null")
    private ScheduleStatus status;

    @Basic
    @Column(name = "status")
    @JsonIgnore
    private Short statusValue;

    @PostLoad
    @SuppressWarnings("unused")
    void fillTransientStatus() {
        if (statusValue >= 0) {
            this.status = ScheduleStatus.of(statusValue);
        }
    }

    @PrePersist
    @SuppressWarnings("unused")
    void fillPersistentStatus() {
        if (statusValue >= 0) {
            statusValue = status.getLabel();
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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

    public Short getStatusValue() {
        return statusValue;
    }

    public void setStatusValue(Short statusValue) {
        this.statusValue = statusValue;
    }
}
