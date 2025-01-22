package com.kalyvianakis.estiator.io.dto;

import com.kalyvianakis.estiator.io.enums.UserRole;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.model.User;

import java.sql.Timestamp;

public class AuthenticatedUser {
    private final String email;
    private final String name;
    private final String surname;
    private final String phone;
    private final UserRole userRole;
    private final String position;
    private final Timestamp createdDate;
    private final String profileImage;
    private final UserStatus status;

    public AuthenticatedUser(User user) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.phone = user.getPhone();
        this.userRole = user.getUserRole();
        this.position = user.getPosition();
        this.createdDate = user.getCreatedDate();
        this.profileImage = user.getProfileImage();
        this.status = user.getStatus();
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getPhone() {
        return phone;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public String getPosition() {
        return position;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public UserStatus getStatus() {
        return status;
    }
}
