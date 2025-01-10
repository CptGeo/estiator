package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IUserService {
    public User save(User user);
    public List<User> get();
    public User get(Integer id) throws ResourceNotFoundException;
    public User getOneByEmail(String email) throws ResourceNotFoundException;
    public List<User> getRegistered();
    public void delete(int id);
    public Boolean exists(int id);
    public Boolean notExists(int id);
}
