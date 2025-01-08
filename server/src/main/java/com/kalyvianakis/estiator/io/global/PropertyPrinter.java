package com.kalyvianakis.estiator.io.global;

import java.lang.reflect.Field;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

abstract public class PropertyPrinter {
    @Override
    public String toString() {
        ReflectionToStringBuilder.setDefaultStyle(ToStringStyle.MULTI_LINE_STYLE);
        return ReflectionToStringBuilder.toString(this);
    }
}

