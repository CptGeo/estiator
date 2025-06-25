package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.dto.SignupAdminRequest;
import com.kalyvianakis.estiator.io.dto.SignupRequest;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.repository.UserRepository;
import com.kalyvianakis.estiator.io.utils.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailSenderService senderService;

    @Transactional
    public void signup(SignupRequest request) throws Exception {
        String email = request.getEmail();
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new DuplicateResourceException(String.format("User with the email address '%s' already exists", email));
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getSurname(), email, request.getPhone(), hashedPassword);

        // set default user role for each new user
        user.setUserRole("ROLE_CLIENT");

        userRepository.save(user);
    }

    public void signupAdmin(SignupAdminRequest request) throws Exception {
        String email = request.getEmail();
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new DuplicateResourceException(String.format("User with the email address '%s' already exists", email));
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getSurname(), email, request.getPhone(), hashedPassword, request.getUserRole());

        userRepository.save(user);
    }

    public void resetPassword(String email) {
        try {
            User user = userRepository.findOneByEmail(email);

            if (user == null) {
                return;
            }

            if (user.getPasswordResetToken() == null) {
                UUID resetToken = UUID.randomUUID();
                user.setPasswordResetToken(resetToken.toString());
                userRepository.save(user);
            }

            senderService.sendResetPassword(user);
        } catch (Exception e) {
            // do not propagate error
        }
    }

    public void setPasswordByToken(String passwordResetToken, String email, String password) {
        if (passwordResetToken == null) throw new AccessDeniedException("You have no permission to change password for user");

        User user = userRepository.findOneByPasswordResetToken(passwordResetToken);

        if (user == null || user.getPasswordResetToken() == null || !user.getEmail().equals(email)) throw new AccessDeniedException("You have no permission to change password for user");

        String hashedPassword = passwordEncoder.encode(password);

        user.setPassword(hashedPassword);
        user.setPasswordResetToken(null);
        userRepository.save(user);

        senderService.sendSimple(user.getEmail(), "Successful password reset - Estiator.io", "Your password has been reset successfully");
    }
}
