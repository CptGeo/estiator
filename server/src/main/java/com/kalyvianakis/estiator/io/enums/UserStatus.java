package com.kalyvianakis.estiator.io.enums;

import java.util.stream.Stream;

public enum UserStatus {
  Active((short) 0),
  On_Leave((short) 1),
  Terminated((short) 2);

  final private Short label;

  UserStatus(Short label) {
    this.label = label;
  }

  public Short getLabel() {
    return label;
  }

  /**
   * Converts an integer representing a status to its corresponding UserStatus enum.
   *
   * @param status the integer representation of the status
   * @return the corresponding Status enum
   * @throws IllegalArgumentException if the provided status integer does not match any Status enum
   */
  public static UserStatus of(Short status) throws IllegalArgumentException {
    return Stream.of(UserStatus.values())
      .filter(s -> s.getLabel().equals(status))
      .findFirst()
      .orElseThrow(IllegalArgumentException::new);
  }
}
