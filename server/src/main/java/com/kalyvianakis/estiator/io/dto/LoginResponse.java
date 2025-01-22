package com.kalyvianakis.estiator.io.dto;

public record LoginResponse(
        String email,
        String token,
        AuthenticatedUser user
) {
}
