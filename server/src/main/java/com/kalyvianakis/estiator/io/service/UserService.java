package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.repository.UserRepository;
import com.kalyvianakis.estiator.io.specifications.UserSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> get() {
        return userRepository.findAll();
    }

    @Override
    public User get(Integer id) throws ResourceNotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + id));
    }

    @Override
    public User getOneByEmail(String email) throws IllegalArgumentException, ResourceNotFoundException {
        if (email == null) {
            throw new IllegalArgumentException("Email must not be null");
        }
        return userRepository.findOne(UserSpecification.emailEquals(email)).orElseThrow(() -> new ResourceNotFoundException("User not found with Email: " + email));
    }

    public List<User> getRegistered() {
        return userRepository.findAll(Specification.where(UserSpecification.isAdmin().or(UserSpecification.isModerator())));
    }

    public List<User> getNotRegistered() {
        return userRepository.findAll(Specification.where(Specification.not(UserSpecification.isAdmin()).and(Specification.not(UserSpecification.isModerator()))));
    }

    @Override
    public void delete(int id) {
        userRepository.deleteById(id);
    }

    @Override
    public Boolean exists(int id) {
        return userRepository.existsById(id);
    }

    @Override
    public Boolean notExists(int id) {
        return !this.exists(id);
    }
}
