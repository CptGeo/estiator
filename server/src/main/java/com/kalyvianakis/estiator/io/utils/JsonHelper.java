package com.kalyvianakis.estiator.io.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kalyvianakis.estiator.io.model.ErrorResponse;
import org.springframework.stereotype.Component;

@Component
public class JsonHelper {
    public static String toJson(ErrorResponse response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(response);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "";
        }
    }
}
