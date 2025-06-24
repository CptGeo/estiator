package com.kalyvianakis.estiator.io.dto;

public class SetNewPasswordRequest {
    private String password;
    private String resetPasswordToken;

    public void setPassword(String password) { this.password = password; }

    public String getPassword() { return password; }

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }
}
