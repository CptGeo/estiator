package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.dto.*;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.model.ErrorResponse;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Response;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.AuthService;
import com.kalyvianakis.estiator.io.service.EmailSenderService;
import com.kalyvianakis.estiator.io.service.UserService;
import com.kalyvianakis.estiator.io.utils.JwtHelper;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailSenderService senderService;

    @PostMapping("/signup")
    public ResponseEntity<Response> signup(@Valid @RequestBody SignupRequest signupRequest, @RequestParam(required = false) Boolean inform) throws Exception {
        if (userService.existsByPhone(signupRequest.getPhone())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(String.format("User with the number %s already exists", signupRequest.getPhone()), "USER_CREATE_ERROR_EXISTS"));
        }

        authService.signup(signupRequest);

        if (inform == null || inform) {
            senderService.sendUserCreated(signupRequest);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(new Response("User had been created successfully", "USER_CREATE_SUCCESS"));
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<Response> signupAdmin(@Valid @RequestBody SignupAdminRequest signupRequest, @RequestParam(required = false) Boolean inform) throws Exception {
        if (userService.existsByPhone(signupRequest.getPhone())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(String.format("User with the number %s already exists", signupRequest.getPhone()), "USER_CREATE_ERROR_EXISTS"));
        }

        authService.signupAdmin(signupRequest);

        if (inform == null || inform) {
            senderService.sendUserCreated(signupRequest);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(new Response("User had been created successfully", "USER_CREATE_SUCCESS"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) throws ResourceNotFoundException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userService.getOneByEmail(request.email());
        String token = jwtHelper.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(request.email(), token));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail());
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/setNewPassword")
    public ResponseEntity<?> setNewPassword(@RequestBody SetNewPasswordRequest request) throws AccessDeniedException {
        authService.setPasswordByToken(request.getResetPasswordToken(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new Response("Password has been reset successfully", "PASSWORD_RESET_SUCCESS"));
    }
}
