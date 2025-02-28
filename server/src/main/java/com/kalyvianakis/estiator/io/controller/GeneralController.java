package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Response;
import com.kalyvianakis.estiator.io.service.ReservationService;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller that handles all root level URIs that cannot be mapped to other, more specific controllers
 */
@RestController
@CrossOrigin
@RequestMapping("/")
public class GeneralController {
    @Autowired
    ReservationService reservationService;

    @PostMapping("/cancelReservation/{uuid}")
    public ResponseEntity<?> cancelReservation(@PathVariable String uuid) throws ResourceNotFoundException {
        if (!reservationService.exists(uuid)) {
            return ResponseEntity.badRequest().build();
        }

        Response response = new Response();
        Reservation reservation = reservationService.get(uuid);
        reservationService.cancel(reservation);
        response.setMessage("Your reservation has been cancelled successfully");
        response.setDetails("Reservation with ID: " + reservation.getId() + " has been cancelled successfully.");

        return ResponseEntity.ok(response);
    }
}
