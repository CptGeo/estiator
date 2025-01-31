package com.kalyvianakis.estiator.io.dto;

import jakarta.validation.constraints.NotBlank;

public class SignupAdminRequest extends SignupRequest {
    @NotBlank(message = "User role cannot be blank")
    private String userRole;

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
}
