package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public User get(int id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        userRepository.deleteById(id);
    }

    @Override
    public boolean exists(int id) {
        return userRepository.existsById(id);
    }

    @Override
    public boolean notExists(int id) {
        return !this.exists(id);
    }
}
