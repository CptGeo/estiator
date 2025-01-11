package com.kalyvianakis.estiator.io.component.patcher;

import org.springframework.stereotype.Component;

import com.kalyvianakis.estiator.io.model.Reservation;

@Component
public class ReservationPatcher implements IPatcher<Reservation>{

  /**
   * Patches current data with data provided from external source (e.g. HTTP request) 
   * @param existing Object to be modified
   * @param incomplete External source data
   */
  public void patch(Reservation existing, Reservation incomplete) {
    if (incomplete.getDate() != null) {
      existing.setDate(incomplete.getDate());
    }
    if (incomplete.getTime() != null) {
      existing.setTime(incomplete.getTime());
    }
    if (incomplete.getStatus() != null) {
      existing.setStatusValue(incomplete.getStatus().getLabel());
      existing.setStatus(incomplete.getStatus());
    }
    if (incomplete.getPersons() != null) {
      existing.setPersons(incomplete.getPersons());
    }

    if (incomplete.getTable() != null) {
      if (incomplete.getTable().getId() == null) {
        existing.setTable(null);
      } else {
        existing.setTable(incomplete.getTable());
      }
    }

    if (incomplete.getCreatedBy() != null) {
      existing.setCreatedBy(incomplete.getCreatedBy());
    }
    if (incomplete.getCreatedFor() != null) {
      existing.setCreatedFor(incomplete.getCreatedFor());
    }
  }
}
