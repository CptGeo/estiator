package com.kalyvianakis.estiator.io.model;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String message;
    private LocalDateTime date;
    private String details;

    public ErrorResponse(String message, String details) {
        this.message = message;
        this.details = details;
        this.date = LocalDateTime.now();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
