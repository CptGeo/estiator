package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IUserService {
    public User save(User user);
    public List<User> get();
    public User get(Integer id) throws ResourceNotFoundException;
    public User getOneByEmail(String email);
    public List<User> getRegistered();
    public List<User> getNotRegistered();
    public void delete(int id);
    public boolean exists(int id);
    public boolean notExists(int id);
}
