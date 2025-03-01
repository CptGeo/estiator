package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.model.ErrorResponse;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Response;
import com.kalyvianakis.estiator.io.service.EmailSenderService;
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

    @Autowired
    EmailSenderService senderService;

    @PostMapping("/cancelReservation/{uuid}")
    public ResponseEntity<?> cancelReservation(@PathVariable String uuid) throws ResourceNotFoundException {
        if (!reservationService.exists(uuid)) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Reservation with UUID: " + uuid + " does not exist", ""));
        }


        Response response = new Response();
        Reservation reservation = reservationService.get(uuid);

        if (reservation.getStatus() == ReservationStatus.Cancelled) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Reservation is already cancelled", ""));
        }

        reservationService.cancel(reservation);
        response.setMessage("Your reservation has been cancelled successfully");
        response.setDetails("");

        senderService.sendReservationCancelled(reservation, "Reservation has been cancelled by client");

        return ResponseEntity.ok(response);
    }
}
