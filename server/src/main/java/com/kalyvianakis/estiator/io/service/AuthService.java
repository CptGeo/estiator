package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.dto.SignupRequest;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.repository.UserRepository;
import com.kalyvianakis.estiator.io.utils.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Transactional
    public void signup(SignupRequest request) throws Exception {
        String email = request.email();
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new DuplicateResourceException(String.format("User with the email address '%s' already exists", email));
        }

        String hashedPassword = passwordEncoder.encode(request.password());
        User user = new User(request.name(), request.surname(), email, request.phone(), hashedPassword);
        userRepository.save(user);
    }
}
