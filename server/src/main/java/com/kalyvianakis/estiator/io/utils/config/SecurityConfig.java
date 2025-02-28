package com.kalyvianakis.estiator.io.utils.config;

import com.kalyvianakis.estiator.io.service.UserService;
import com.kalyvianakis.estiator.io.utils.AccessDeniedExceptionHandler;
import com.kalyvianakis.estiator.io.utils.AuthenticationEntryPointHandler;
import com.kalyvianakis.estiator.io.utils.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        return http
                .exceptionHandling(exception -> exception.accessDeniedHandler(new AccessDeniedExceptionHandler()).authenticationEntryPoint(new AuthenticationEntryPointHandler()))
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/signup/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/auth/signup/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/reservations/**").hasAnyAuthority( "ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.POST, "/reservations/**").hasAnyAuthority( "ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.PATCH, "/reservations/**").hasAnyAuthority( "ROLE_ADMIN", "ROLE_MODERATOR")

                        .requestMatchers(HttpMethod.GET, "/tables/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.POST, "/tables/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.PATCH, "/tables/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")

                        .requestMatchers(HttpMethod.GET ,"/users/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.PATCH ,"/users/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")

                        .requestMatchers(HttpMethod.POST, "/cancelReservation/**").permitAll()

                        .requestMatchers("/users/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/schedules/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.DELETE).hasAuthority("ROLE_ADMIN")
                        .anyRequest().hasAuthority("ROLE_ADMIN"))
                .authenticationManager(authenticationManager)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }
}
