package com.kalyvianakis.estiator.io.controller;

import java.nio.file.AccessDeniedException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.kalyvianakis.estiator.io.dto.ReservationRequest;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.UserService;
import com.kalyvianakis.estiator.io.utils.JwtHelper;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kalyvianakis.estiator.io.component.patcher.ReservationPatcher;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.service.ReservationService;

@RestController
@CrossOrigin
@RequestMapping("reservations")
@SuppressWarnings("unused")
public class ReservationController {
  @Autowired
  ReservationService reservationService;

  @Autowired
  ReservationPatcher reservationPatcher;

  @Autowired
  JwtHelper jwtHelper;

  @Autowired
  UserService userService;

  @PostMapping
  public ResponseEntity<Reservation> add(@RequestBody ReservationRequest request, @RequestHeader(name = "Authorization") String token) throws ResourceNotFoundException, AccessDeniedException {
      Reservation reservation = new Reservation();
      String createdByEmail = jwtHelper.extractUsername(token.substring(7));
      User createdBy = userService.getOneByEmail(createdByEmail);
      reservation.setCreatedBy(createdBy);

      if (userService.existsByEmail(request.getEmail())) {
          // assign existing user to reservation, if email exists
          reservation.setCreatedFor(userService.getOneByEmail(request.getEmail()));
      } else {
          // create a new guest user and assign to reservation
          User user = new User();
          user.setName(request.getName());
          user.setSurname(request.getSurname());
          user.setEmail(request.getEmail());
          if (request.getPhone() != null) {
              user.setPhone(request.getPhone());
          }
          user.setUserRole("ROLE_GUEST");
          user.setStatus(UserStatus.Active);
          user.setStatusValue(UserStatus.Active.getLabel());
          reservation.setCreatedFor(userService.saveAndFlush(user));
      }

      reservation.setDate(request.getDate());
      reservation.setPersons(request.getPersons());
      reservation.setStatus(request.getStatus());
      reservation.setStatusValue(request.getStatus().getLabel());
      reservation.setTable(request.getTable());
      reservation.setTime(request.getTime());

      return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.save(reservation));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> get(@PathVariable Long id) throws ResourceNotFoundException {
      return ResponseEntity.ok().body(reservationService.get(id));
  }

  @GetMapping
  public ResponseEntity<?> get(@RequestParam(name = "count", required = false) Boolean count, @RequestParam(name = "dateFrom", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate from,  @RequestParam(name = "dateTo", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate to) {
      if (from != null && to != null && count != null && count) {
          return ResponseEntity.ok().body(reservationService.getCountByDateBetween(from, to));
      }

      if (to != null && count != null && count) {
          return ResponseEntity.ok().body(reservationService.getCountByDateLessThanEqual(to));
      }

      if (count != null && count) {
          return ResponseEntity.ok().body(reservationService.getCount());
      }

      return ResponseEntity.ok().body(reservationService.get());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException {
      if (reservationService.notExists(id)) {
        throw new ResourceNotFoundException("Reservation not found for ID: " + id);
      }

      reservationService.delete(id);
      return ResponseEntity.ok().body(new MessageResponse("Reservation deleted for ID: " + id, ""));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Reservation reservation) throws ResourceNotFoundException {
      Reservation current = reservationService.get(id);

      reservationPatcher.patch(current, reservation);
      reservationService.save(current);

      return ResponseEntity.ok().body(current);
  }
  
}
