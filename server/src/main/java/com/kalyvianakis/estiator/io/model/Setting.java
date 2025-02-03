package com.kalyvianakis.estiator.io.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kalyvianakis.estiator.io.utils.PropertyPrinter;
import jakarta.persistence.Table;
import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class Setting extends PropertyPrinter {
    @Id
    private String id;

    private String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
