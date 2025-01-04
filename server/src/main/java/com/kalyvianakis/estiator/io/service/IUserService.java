package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IUserService {
    public User save(User user);
    public List<User> get();
    public User get(int id);
    public void delete(int id);
    public boolean exists(int id);
    public boolean notExists(int id);
}
