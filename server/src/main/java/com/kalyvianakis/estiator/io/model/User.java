package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.*;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.*;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.SourceType;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@jakarta.persistence.Table(name = "users")
public class User extends PropertyPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long id;

    @CurrentTimestamp(source = SourceType.DB)
    private Timestamp createdDate;

    private String name;

    private String surname;

    @Column(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(unique = true)
    private String phone;

    private String position;

    private String profileImage;

    @Transient
    private UserStatus status;

    private String userRole;

    @Basic
    @Column(name = "status")
    @JsonIgnore
    private Short statusValue;

    @PostLoad
    @SuppressWarnings("unused")
    void fillTransientStatus() {
        if (this.getStatusValue() != null && statusValue >= 0) {
            this.status = UserStatus.of(statusValue);
        }
    }

    @PrePersist
    @SuppressWarnings("unused")
    void fillPersistentStatus() {
        if (this.getStatusValue() != null && statusValue >= 0) {
            statusValue = status.getLabel();
        } else {
            this.setStatusValue(UserStatus.Active.getLabel());
            this.setStatus(UserStatus.Active);
        }
    }

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" })
    private List<Table> tables;

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = { "table", "user", "createdBy", "createdFor" })
    private List<Reservation> createdReservations;

    @OneToMany(mappedBy = "createdFor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = { "table", "user", "createdBy", "createdFor" })
    private List<Reservation> referredReservations;

    @ManyToMany
    @JoinTable(
            name = "user-dietary-preferences",
            inverseJoinColumns = @JoinColumn(name = "dietary_preference_id")
    )
    private Set<DietaryPreference> dietaryPreferences = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties(value = { "user" })
    private List<Schedule> schedules;

    public User(String name, String surname, String email, String phone, String password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    public User(String name, String surname, String email, String phone, String password, String userRole) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.userRole = userRole;
    }

    public User() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

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

    public List<Schedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }

    public String getUserRole() { return userRole; }

    public void setUserRole(String userRole) { this.userRole = userRole; }

    public Set<DietaryPreference> getDietaryPreferences() {
        return dietaryPreferences;
    }

    public void setDietaryPreferences(Set<DietaryPreference> dietaryPreferences) {
        this.dietaryPreferences = dietaryPreferences;
    }
}
