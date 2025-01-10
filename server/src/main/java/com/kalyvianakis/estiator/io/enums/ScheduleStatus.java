package com.kalyvianakis.estiator.io.enums;

import java.util.stream.Stream;

public enum ScheduleStatus {
    Working((short) 0),
    On_Leave((short) 1),
    Sick((short) 2);

    final private Short label;

    ScheduleStatus(Short label) {
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
     * @throws IllegalArgumentException if the provided status integer does not match any ScheduleStatus enum
     */
    public static ScheduleStatus of(Short status) throws IllegalArgumentException {
        return Stream.of(ScheduleStatus.values())
                .filter(s -> s.getLabel().equals(status))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
