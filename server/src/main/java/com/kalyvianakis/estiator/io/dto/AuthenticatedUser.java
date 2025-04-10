package com.kalyvianakis.estiator.io.dto;

import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

public class AuthenticatedUser extends User implements UserDetails {

    private final User user;

    public AuthenticatedUser(User user) {
        this.user = user;
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getName() {
        return user.getName();
    }

    public String getSurname() {
        return user.getSurname();
    }

    public String getPhone() {
        return user.getPhone();
    }

    public String getUserRole() {
        return user.getUserRole();
    }

    public String getPosition() {
        return user.getPosition();
    }

    public Timestamp getCreatedDate() {
        return user.getCreatedDate();
    }

    public String getProfileImage() {
        return user.getProfileImage();
    }

    public UserStatus getStatus() {
        return user.getStatus();
    }

    public Long getId() {
        return user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) user::getUserRole);
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

}
