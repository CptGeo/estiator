package com.kalyvianakis.estiator.io.enums;

import java.util.stream.Stream;

public enum Status {
  Pending((short) 0), 
  Cancelled((short) 1),
  Confirmed((short) 2),
  Completed((short) 3);

  private Short label;

  Status(Short label) {
    this.label = label;
  }

  public Short getLabel() {
    return label;
  }

  /**
   * Converts an integer representating a status to its corresponding Status enum.
   *
   * @param status the integer representation of the status
   * @return the corresponding Status enum
   * @throws IllegalArgumentException if the provided status integer does not match any Status enum
   */
  public static Status of(Short status) throws IllegalArgumentException {
    return Stream.of(Status.values())
      .filter(s -> s.getLabel() == status)
      .findFirst()
      .orElseThrow(IllegalArgumentException::new);
  }
}
