package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IUserService {
    public User save(User user);
    public List<User> get();
    public User get(Long id) throws ResourceNotFoundException;
    public User getOneByEmail(String email) throws ResourceNotFoundException;
    public List<User> getRegistered();
    public void delete(Long id);
    public Boolean exists(Long id);
    public Boolean notExists(Long id);
}
