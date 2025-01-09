package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.*;
import com.kalyvianakis.estiator.io.enums.UserRole;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.global.PropertyPrinter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.SourceType;

import java.sql.Timestamp;
import java.util.List;

@Entity
@jakarta.persistence.Table(name = "users")
public class User extends PropertyPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @CurrentTimestamp(source = SourceType.DB)
    private Timestamp createdDate;

    @NotBlank(message = "Name must not be empty")
    private String name;

    @NotBlank(message = "Surname must not be empty")
    private String surname;

    @NotBlank(message = "Email must not be empty")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password must not be empty")
    private String password;

    @Column(unique = true)
    private String phone;

    private String position;

    private String profileImage;

    @Transient
    @NotNull(message = "Status must not be null")
    private UserStatus status;

    @Basic
    @Column(name = "status")
    @JsonIgnore
    private Short statusValue;

    @Transient
    @NotNull(message = "User role must not be null")
    private UserRole userRole;

    @Basic
    @Column(name = "user_role")
    @JsonIgnore
    private Short userRoleValue;



    @PostLoad
    @SuppressWarnings("unused")
    void fillTransientStatus() {
        if (statusValue >= 0) {
            this.status = UserStatus.of(statusValue);
        }
        if (userRoleValue >= 0) {
            this.userRole = UserRole.of(userRoleValue);
        }
    }

    @PrePersist
    @SuppressWarnings("unused")
    void fillPersistentStatus() {
        if (statusValue >= 0) {
            statusValue = status.getLabel();
        }

        if (userRoleValue >= 0) {
            userRoleValue = userRole.getLabel();
        }
    }

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" })
    private List<Table> tables;

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "table", "user" })
    private List<Reservation> createdReservations;

    @OneToMany(mappedBy = "createdFor", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "table", "user" })
    private List<Reservation> referredReservations;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties(value = { "user" })
    private List<Schedule> schedules;

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

    public List<Reservation> getCreatedReservations() { return createdReservations; }

    public void setCreatedReservations(List<Reservation> reservations) { this.createdReservations = reservations; }

    public List<Reservation> getReferredReservations() { return referredReservations; }

    public void setReferredReservations(List<Reservation> referredReservations) { this.referredReservations = referredReservations; }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public Short getUserRoleValue() {
        return userRoleValue;
    }

    public void setUserRoleValue(Short userRoleValue) {
        this.userRoleValue = userRoleValue;
    }

    public List<Schedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }
}
