package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "dietary-preferences")
public class DietaryPreference extends PropertyPrinter {
    @Id
    private String id;

    private String name;

    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "dietaryPreferences")
    private Set<User> users = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
