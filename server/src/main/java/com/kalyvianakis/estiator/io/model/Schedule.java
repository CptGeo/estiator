package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kalyvianakis.estiator.io.global.PropertyPrinter;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(name = "UniqueUserAndDate", columnNames = { "user_id", "date" }))
public class Schedule extends PropertyPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", columnDefinition = "INT UNSIGNED", nullable = false)
    @JsonIgnoreProperties(value = { "tables", "reservations", "createdReservations", "referredReservations", "schedules" })
    @JsonProperty(value = "user", access = JsonProperty.Access.WRITE_ONLY)
    private User user;
    private Date date;
    private Time startTime;
    private Time endTime;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
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
}
