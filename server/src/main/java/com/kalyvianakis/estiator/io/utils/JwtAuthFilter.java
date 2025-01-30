package com.kalyvianakis.estiator.io.utils;

import com.kalyvianakis.estiator.io.model.ErrorResponse;
import com.kalyvianakis.estiator.io.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;

    @Autowired
    private JsonHelper jsonHelper;

    @Autowired
    private  JwtHelper jwtHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, JwtException {
        // Set universal headers to prevent CORS issues
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Content-Type", MediaType.APPLICATION_JSON.toString());

        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtHelper.extractUsername(token);
            }

            response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token");
            response.addHeader("Access-Control-Expose-Headers", "xsrf-token");

            if (request.getMethod().equals("OPTIONS")) {
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            // if access token is null, pass request to next filter
            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // if any accessToken is present, validate
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.loadUserByUsername(username);

                if (jwtHelper.validateToken(token, user)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println(authenticationToken.getDetails());
                }
            }

            filterChain.doFilter(request, response);
        }
        catch (JwtException e) {
            // token is possibly forged or modified; User is considered to be not authenticated.
            ErrorResponse errorResponse = new ErrorResponse("It seems like you are not authenticated. Please try logging in.", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            response.getWriter().write(JsonHelper.toJson(errorResponse));
        }
    }
}
