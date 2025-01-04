package com.kalyvianakis.estiator.io.model;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;

import jakarta.persistence.*;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.SourceType;

@Entity
@jakarta.persistence.Table(name = "reservations")
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private Date date;

  private Time time;

  @Basic
  @Column(name = "status")
  private Short statusValue;

  @Transient
  private ReservationStatus status;

  private Integer persons;

  @ManyToOne
  @JoinColumn(name = "table_id", referencedColumnName = "id")
  @JsonIgnoreProperties(value = { "user" })
  private Table table;

  @CurrentTimestamp(source = SourceType.DB)
  private Timestamp createdDate;

  @ManyToOne
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  @JsonIgnoreProperties(value = { "tables", "reservations" })
  private User user;

  @PostLoad
  void fillTransientStatus() {
      if (statusValue >= 0) {
          this.status = ReservationStatus.of(statusValue);
      }
  }

  @PrePersist
  @PreUpdate
  void fillPersistentStatus() {
      if (statusValue >= 0) {
          this.statusValue = status.getLabel();
      }
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

  public Time getTime() {
    return time;
  }

  public void setTime(Time time) {
    this.time = time;
  }

  public ReservationStatus getStatus() {
    return status;
  }

  public void setStatus(ReservationStatus status) {
    this.status = status;
  }

  public Short getStatusValue() {
    return statusValue;
  }

  public void setStatusValue(Short statusValue) {
    this.statusValue = statusValue;
  }

  public Integer getPersons() {
    return persons;
  }

  public void setPersons(Integer persons) {
    this.persons = persons;
  }

  public Table getTable() {
    return table;
  }

  public void setTable(Table table) {
    this.table = table;
  }

  public Timestamp getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Timestamp createdDate) {
    this.createdDate = createdDate;
  }

  public User getUser() { return user; }

  public void setUser(User user) { this.user = user; }
}
