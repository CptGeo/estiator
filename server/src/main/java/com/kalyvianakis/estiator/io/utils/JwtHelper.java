package com.kalyvianakis.estiator.io.utils;

import com.kalyvianakis.estiator.io.dto.AuthenticatedUser;
import com.kalyvianakis.estiator.io.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtHelper {

    @Autowired
    ApplicationProperties applicationProperties;

    private static final Integer MINUTES = 60;

    public String generateToken(User user) {
        Instant now = Instant.now();
        AuthenticatedUser authUser = new AuthenticatedUser(user);
        return Jwts.builder()
                .subject(authUser.getEmail())
                .claim("user", authUser)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(MINUTES, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, applicationProperties.getJwtSecret())
                .compact();
    }

    public String extractUsername(String token) throws AccessDeniedException {
        return getTokenBody(token).getSubject();
    }

    private Claims getTokenBody(String token) throws AccessDeniedException {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(applicationProperties.getJwtSecret())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new AccessDeniedException("Access denied: " + e.getMessage());
        }
    }

    public Boolean validateToken(String token, UserDetails userDetails) throws AccessDeniedException {
        final String username = extractUsername(token);
        userDetails.getAuthorities();
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private Boolean isTokenExpired(String token) throws AccessDeniedException {
        Claims claims = getTokenBody(token);
        return claims.getExpiration().before(new Date());
    }

}
