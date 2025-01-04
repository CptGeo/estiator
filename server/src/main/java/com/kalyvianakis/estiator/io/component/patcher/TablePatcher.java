package com.kalyvianakis.estiator.io.component.patcher;

import org.springframework.stereotype.Component;

import com.kalyvianakis.estiator.io.model.Table;

@Component
public class TablePatcher implements IPatcher<Table>{

  /**
   * Patches current data with data provided from external source (e.g. HTTP request) 
   * @param existing Object to be modified
   * @param incomplete External source data
   */
  public void patch(Table existing, Table incomplete) {
    if (incomplete.getLabel() != null) {
      existing.setLabel(incomplete.getLabel());
    }
    if (incomplete.getColor() != null) {
      existing.setColor(incomplete.getColor());
    }
    if (incomplete.getCapacity() != null) {
      existing.setCapacity(incomplete.getCapacity());
    }
    if (incomplete.getX() != null) {
      existing.setX(incomplete.getX());
    }
    if (incomplete.getY() != null) {
      existing.setY(incomplete.getY());
    }
    if (incomplete.getUser() != null) {
      existing.setUser(incomplete.getUser());
    }
  }
}
