package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IUserService {
    User save(User user);
    User saveAndFlush(User user);
    List<User> get();
    User get(Long id) throws ResourceNotFoundException;
    User getOneByEmail(String email) throws ResourceNotFoundException;
    void delete(Long id);
    Boolean exists(Long id);
    Boolean notExists(Long id);
}
