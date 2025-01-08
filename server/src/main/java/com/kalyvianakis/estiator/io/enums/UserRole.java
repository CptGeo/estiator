package com.kalyvianakis.estiator.io.enums;

import java.util.stream.Stream;

public enum UserRole {
  Admin((short) 0),
  Moderator((short) 1),
  Guest((short) 2);

  final private Short label;

  UserRole(Short label) {
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
   * @throws IllegalArgumentException if the provided status integer does not match any UserRole enum
   */
  public static UserRole of(Short status) throws IllegalArgumentException {
    return Stream.of(UserRole.values())
      .filter(s -> s.getLabel().equals(status))
      .findFirst()
      .orElseThrow(IllegalArgumentException::new);
  }
}
