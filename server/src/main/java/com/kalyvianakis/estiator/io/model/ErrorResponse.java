package com.kalyvianakis.estiator.io.model;

public class ErrorResponse extends Response {
    public ErrorResponse(String message, String details) {
        super(message, details);
    }
}
