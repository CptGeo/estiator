package com.kalyvianakis.estiator.io.component.patcher;

import com.kalyvianakis.estiator.io.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserPatcher implements IPatcher<User>{

  /**
   * Patches current data with data provided from external source (e.g. HTTP request) 
   * @param existing Object to be modified
   * @param incomplete External source data
   */
  public void patch(User existing, User incomplete) {

    if (incomplete.getName() != null) {
      existing.setName(incomplete.getName());
    }
    if (incomplete.getSurname() != null) {
      existing.setSurname(incomplete.getSurname());
    }
    if (incomplete.getPassword() != null) {
      existing.setPassword(incomplete.getPassword());
    }
    if (incomplete.getPosition() != null) {
      existing.setPosition(incomplete.getPosition());
    }
    if (incomplete.getEmail() != null) {
      existing.setEmail(incomplete.getEmail());
    }
    if (incomplete.getPhone() != null) {
      existing.setPhone(incomplete.getPhone());
    }
    if (incomplete.getStatus() != null) {
      existing.setStatusValue(incomplete.getStatus().getLabel());
      existing.setStatus(incomplete.getStatus());
    }
    if (incomplete.getUserRole() != null) {
      existing.setUserRole(incomplete.getUserRole());
    }
    if (incomplete.getProfileImage() != null) {
      existing.setProfileImage(incomplete.getProfileImage());
    }
    if (incomplete.getTables() != null) {
      existing.setTables(incomplete.getTables());
    }
  }
}
