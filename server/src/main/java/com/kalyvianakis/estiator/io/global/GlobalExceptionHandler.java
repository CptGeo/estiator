package com.kalyvianakis.estiator.io.global;

import com.kalyvianakis.estiator.io.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknownException(Exception e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "UNKNOWN_EXCEPTION");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "RESOURCE_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(IllegalArgumentException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "INVALID_ARGUMENT");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
