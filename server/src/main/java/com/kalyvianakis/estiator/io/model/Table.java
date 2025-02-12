package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@jakarta.persistence.Table(name = "tables")
public class Table extends PropertyPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    private Integer capacity;

    private Integer x;

    private Integer y;

    private String color;

    @Transient
    private Boolean occupied;

    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnoreProperties(value = { "reservations", "tables" })
    private User user;

    @OneToMany(mappedBy = "table", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST, orphanRemoval = false)
    @JsonIgnoreProperties(value = { "table" })
    private List<Reservation> reservations;

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public List<Reservation> getReservations() { return reservations; }

    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }

    public Boolean getOccupied() {
        return occupied;
    }

    public void setOccupied(Boolean occupied) {
        this.occupied = occupied;
    }
}
