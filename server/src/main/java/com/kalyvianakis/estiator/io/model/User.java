package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.*;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.SourceType;

import java.sql.Timestamp;
import java.util.List;

@Entity
@jakarta.persistence.Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @CurrentTimestamp(source = SourceType.DB)
    private Timestamp createdDate;

    private String name;

    private String surname;

    private String email;

    private String password;

    private String phone;

    private String position;

    private String profileImage;

    @Transient
    private UserStatus status;

    @Basic
    @Column(name = "status")
    @JsonIgnore
    private Short statusValue;

    @PostLoad
    void fillTransientStatus() {
        if (statusValue >= 0) {
            this.status = UserStatus.of(statusValue);
        }
    }

    @PrePersist
    void fillPersistentStatus() {
        if (statusValue >= 0) {
            this.statusValue = status.getLabel();
        }
    }

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" })
    private List<Table> tables;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "table", "user" })
    private List<Reservation> reservations;

    private Integer getId() {
        return id;
    }

    public void setId(Integer id) { this.id = id; }

    public Timestamp getCreatedDate() { return createdDate; }

    public void setCreatedDate(Timestamp createdDate) { this.createdDate = createdDate; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }

    public void setSurname(String surname) { this.surname = surname; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getPosition() { return position; }

    public void setPosition(String position) { this.position = position; }

    public String getProfileImage() { return profileImage; }

    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public UserStatus getStatus() { return status; }

    public void setStatus(UserStatus status) { this.status = status; }

    public List<Table> getTables() { return tables; }

    public void setTables(List<Table> tables) { this.tables = tables; }

    public Short getStatusValue() { return statusValue; }

    public void setStatusValue(Short statusValue) { this.statusValue = statusValue; }

    public List<Reservation> getReservations() { return reservations; }

    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}
