package com.kalyvianakis.estiator.io.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyvianakis.estiator.io.component.patcher.ReservationPatcher;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.service.ReservationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin
@RequestMapping("reservations")
public class ReservationController {
  @Autowired
  ReservationService reservationService;

  @Autowired
  ReservationPatcher reservationPatcher;

  @PostMapping
  public ResponseEntity<String> add(@RequestBody Reservation reservation) {
      try {
          reservationService.save(reservation);
          return ResponseEntity.ok().body("Resource has been added successfully");
      } catch (Exception e) {
          return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
      }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> get(@PathVariable Integer id) {
    try {
      Reservation reservation = reservationService.get(id);
      if (reservation == null) {
        return ResponseEntity.badRequest().body("Resource not found for ID: " + id);
      }
      return ResponseEntity.ok().body(reservation);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
    }
  }

  @GetMapping()
  public ResponseEntity<List<Reservation>> get() {
    return ResponseEntity.ok().body(reservationService.get());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Integer id) {
    try {
      if (reservationService.notExists(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
      }
      reservationService.delete(id);
      return ResponseEntity.ok().body("Resource deleted for ID: " + id);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
    }
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> patch(@PathVariable Integer id, @RequestBody Reservation reservation) {
      try {
          if (id == null || id < 0) {
              return ResponseEntity.badRequest().body("Invalid ID provided");
          }

          Reservation current = reservationService.get(id);

          if(current == null) {
              return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
          }

          reservationPatcher.patch(current, reservation); 
          reservationService.save(current);

          return ResponseEntity.ok().body(current);
      } catch (IllegalArgumentException e) {
          return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
      }
  }
  
}
