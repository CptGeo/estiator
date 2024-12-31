package com.kalyvianakis.estiator.io.model;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import com.kalyvianakis.estiator.io.enums.Status;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Transient;

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
  private Status status;

  private Integer persons;

  @OneToOne
  @JoinColumn(name = "table_id", referencedColumnName = "id")
  private Table table;

  private Timestamp createdDate;

  /** @todo Missing non-implemented User property */

  @PostLoad
  void fillTransientStatus() {
      if (statusValue >= 0) {
          this.status = Status.of(statusValue);
      }
  }

  @PrePersist
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

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
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
}
