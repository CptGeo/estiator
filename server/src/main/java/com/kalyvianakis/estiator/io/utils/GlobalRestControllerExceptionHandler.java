package com.kalyvianakis.estiator.io.utils;

import com.kalyvianakis.estiator.io.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
public class GlobalRestControllerExceptionHandler {
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknownException(Exception e, HttpServletRequest httpServletRequest) {
        Arrays.stream(e.getStackTrace()).forEach(System.err::println);
        ErrorResponse response = new ErrorResponse(e.getMessage(), "UNKNOWN_EXCEPTION");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "RESOURCE_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "INVALID_ARGUMENT");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "BAD_CREDENTIALS");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "DUPLICATE_RESOURCE");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateKeyException(DuplicateKeyException e, HttpServletRequest httpServletRequest) {
        ErrorResponse response = new ErrorResponse(e.getMessage(), "DUPLICATE_KEY");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

}
