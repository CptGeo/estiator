package com.kalyvianakis.estiator.io.controller;

import java.util.List;

import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
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

@RestController
@CrossOrigin
@RequestMapping("reservations")
@SuppressWarnings("unused")
public class ReservationController {
  @Autowired
  ReservationService reservationService;

  @Autowired
  ReservationPatcher reservationPatcher;

  @PostMapping
  public ResponseEntity<Reservation> add(@RequestBody Reservation reservation) {
      return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.save(reservation));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> get(@PathVariable Long id) throws ResourceNotFoundException {
      return ResponseEntity.ok().body(reservationService.get(id));
  }

  @GetMapping()
  public ResponseEntity<List<Reservation>> get() {
    return ResponseEntity.ok().body(reservationService.get());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException {
      if (reservationService.notExists(id)) {
        throw new ResourceNotFoundException("Reservation not found for ID: " + id);
      }

      reservationService.delete(id);
      return ResponseEntity.ok().body(new MessageResponse("Reservation deleted for ID: " + id));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Reservation reservation) throws ResourceNotFoundException {
      Reservation current = reservationService.get(id);

      reservationPatcher.patch(current, reservation);
      reservationService.save(current);

      return ResponseEntity.ok().body(current);
  }
  
}
