package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.enums.UserRole;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.repository.ScheduleRepository;
import com.kalyvianakis.estiator.io.repository.UserRepository;
import com.kalyvianakis.estiator.io.specifications.UserSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class UserService implements IUserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> get() {
        return userRepository.findAll();
    }

    @Override
    public User get(Long id) throws ResourceNotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + id));
    }

    @Override
    public User getOneByEmail(String email) throws IllegalArgumentException, ResourceNotFoundException {
        if (email == null) {
            throw new IllegalArgumentException("Email must not be null");
        }
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found with Email: " + email));
    }

    public List<User> getRegistered() {
        List<Short> roleValues = new ArrayList<>();
        roleValues.add(UserRole.Moderator.getLabel());
        roleValues.add(UserRole.Admin.getLabel());
        return userRepository.findByUserRoleValueIn(roleValues);
    }

    public User getRegistered(Long id) throws ResourceNotFoundException {
        List<Short> roleValues = new ArrayList<>();
        roleValues.add(UserRole.Moderator.getLabel());
        roleValues.add(UserRole.Admin.getLabel());
        return userRepository.findByIdAndUserRoleValueIn(id, roleValues).orElseThrow(() -> new ResourceNotFoundException("Registered user not found with ID: " + id));
    }

    public List<User> getGuest() {
        List<Short> roleValues = new ArrayList<>();
        roleValues.add(UserRole.Guest.getLabel());
        return userRepository.findByUserRoleValueIn(roleValues);
    }

    public List<Schedule> getSchedule(Long id) {
        return scheduleRepository.findByUserId(id, Sort.by("date").ascending());
    }

    public Schedule getScheduleByDate(Long id, LocalDate date) {
        return scheduleRepository.findByUserIdAndDate(id, date);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(String.format("User does not exist, email: %s", username)));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Boolean exists(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public Boolean notExists(Long id) {
        return !this.exists(id);
    }
}
