package com.kalyvianakis.estiator.io.model;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;

import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.SourceType;

@Entity
@jakarta.persistence.Table(name = "reservations")
public class Reservation extends PropertyPrinter {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private LocalDate date;

  private LocalTime time;

  @Basic
  @Column(name = "status")
  private Short statusValue;

  @Transient
  private ReservationStatus status;

  private Integer persons;

  private Integer duration;

  private String cancellationUUID;

  private Boolean isArchived;

  @Transient
  private Integer conflicts;

  @Max(6)
  private Integer rating;

  private String review;

  @ManyToOne
  @JoinColumn(name = "table_id", referencedColumnName = "id", nullable = true)
  @JsonIgnoreProperties(value = { "user", "reservations" })
  private Table table;

  @CurrentTimestamp(source = SourceType.DB)
  private Timestamp createdDate;

  @ManyToOne
  @JoinColumn(name = "created_by_user_id", referencedColumnName = "id")
  @JsonIgnoreProperties(value = { "tables", "reservations", "createdReservations", "referredReservations", "dietaryPreferences" })
  @JsonProperty(value = "createdBy")
  private User createdBy;

  @ManyToOne
  @JoinColumn(name = "created_for_user_id", referencedColumnName = "id")
  @JsonIgnoreProperties(value = { "tables", "reservations", "createdReservations", "referredReservations", "dietaryPreferences" })
  @JsonProperty(value = "createdFor")
  private User createdFor;

  @Transient
  private LocalTime endTime;

  public Reservation(LocalDate date, LocalTime time, ReservationStatus status, Table table, User createdBy, User createdFor) {
    this.date = date;
    this.time = time;
    this.status = status;
    this.table = table;
    this.createdBy = createdBy;
    this.createdFor = createdFor;
  }

  public Reservation() {}

  @PostLoad
  @SuppressWarnings("unused")
  void fillTransientStatus() {
      if (statusValue >= 0) {
          this.status = ReservationStatus.of(statusValue);
      }
      endTime = this.time.plusSeconds(duration);
  }

  @PrePersist
  @PreUpdate
  @SuppressWarnings("unused")
  void fillPersistentStatus() {
      if (statusValue >= 0) {
          this.statusValue = status.getLabel();
      }
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

  public LocalTime getTime() {
    return time;
  }

  public void setTime(LocalTime time) {
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

  public User getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(User user) {
    this.createdBy = user;
  }

  public User getCreatedFor() {
    return createdFor;
  }

  public void setCreatedFor(User user) {
    this.createdFor = user;
  }

  public Integer getDuration() {
    return duration;
  }

  public void setDuration(Integer duration) {
    this.duration = duration;
  }

  public Integer getConflicts() {
    return conflicts;
  }
  public void setConflicts(Integer conflicts) {
    this.conflicts = conflicts;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalTime endTime) {
    this.endTime = endTime;
  }

  public String getCancellationUUID() {
    return cancellationUUID;
  }

  public void setCancellationUUID(String cancellationUUID) {
    this.cancellationUUID = cancellationUUID;
  }

  public Boolean getArchived() {
    return isArchived;
  }

  public void setArchived(Boolean archived) {
    isArchived = archived;
  }

  public @Max(6) Integer getRating() {
    return rating;
  }

  public void setRating(@Max(6) Integer rating) {
    this.rating = rating;
  }

  public String getReview() {
    return review;
  }

  public void setReview(String review) {
    this.review = review;
  }
}
