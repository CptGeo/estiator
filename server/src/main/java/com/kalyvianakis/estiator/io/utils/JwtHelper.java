package com.kalyvianakis.estiator.io.utils;

import com.kalyvianakis.estiator.io.dto.AuthenticatedUser;
import com.kalyvianakis.estiator.io.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.file.AccessDeniedException;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class JwtHelper {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final Integer MINUTES = 60;

    public static String generateToken(User user) {
        Instant now = Instant.now();
        AuthenticatedUser authUser = new AuthenticatedUser(user);
        return Jwts.builder()
                .subject(authUser.getEmail())
                .claim("user", authUser)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(MINUTES, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static String extractUsername(String token) throws AccessDeniedException {
        return getTokenBody(token).getSubject();
    }

    private static Claims getTokenBody(String token) throws AccessDeniedException {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new AccessDeniedException("Access denied: " + e.getMessage());
        }
    }

    public static Boolean validateToken(String token, UserDetails userDetails) throws AccessDeniedException {
        final String username = extractUsername(token);
        userDetails.getAuthorities();
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private static Boolean isTokenExpired(String token) throws AccessDeniedException {
        Claims claims = getTokenBody(token);
        return claims.getExpiration().before(new Date());
    }

}
