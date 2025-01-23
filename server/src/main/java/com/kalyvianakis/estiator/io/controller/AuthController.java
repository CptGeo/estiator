package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.dto.LoginRequest;
import com.kalyvianakis.estiator.io.dto.LoginResponse;
import com.kalyvianakis.estiator.io.dto.SignupRequest;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.AuthService;
import com.kalyvianakis.estiator.io.service.UserService;
import com.kalyvianakis.estiator.io.utils.JwtHelper;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest requestDto) throws Exception {
        authService.signup(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) throws ResourceNotFoundException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userService.getOneByEmail(request.email());
        String token = jwtHelper.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(request.email(), token));
    }
}
