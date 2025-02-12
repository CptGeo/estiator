package com.kalyvianakis.estiator.io.enums;

import java.util.stream.Stream;

public enum ReservationStatus {
  Pending((short) 0), 
  Cancelled((short) 1),
  Confirmed((short) 2),
  Booked((short) 3),
  Completed((short) 4);

  final private Short label;

  ReservationStatus(Short label) {
    this.label = label;
  }

  public Short getLabel() {
    return label;
  }

  /**
   * Converts an integer representing a status to its corresponding Status enum.
   *
   * @param status the integer representation of the status
   * @return the corresponding Status enum
   * @throws IllegalArgumentException if the provided status integer does not match any ReservationStatus enum
   */
  public static ReservationStatus of(Short status) throws IllegalArgumentException {
    return Stream.of(ReservationStatus.values())
      .filter(s -> s.getLabel().equals(status))
      .findFirst()
      .orElseThrow(IllegalArgumentException::new);
  }
}
