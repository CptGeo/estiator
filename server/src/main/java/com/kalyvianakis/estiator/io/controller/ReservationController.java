package com.kalyvianakis.estiator.io.controller;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.kalyvianakis.estiator.io.dto.ReservationRequest;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.model.Response;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.EmailSenderService;
import com.kalyvianakis.estiator.io.service.TableService;
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

  @Autowired
  public TableService tableService;

  @Autowired
  EmailSenderService senderService;

  @PostMapping
  public ResponseEntity<Reservation> add(
          @RequestBody ReservationRequest request,
          @RequestHeader(required = false, name = "Authorization") String token,
          @RequestParam(required = false) Boolean inform
  ) throws ResourceNotFoundException, AccessDeniedException {
      Reservation reservation = new Reservation();

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

      if (token != null) {
          // authenticated user; set as the creator
          String createdByEmail = jwtHelper.extractUsername(token.substring(7));
          User createdBy = userService.getOneByEmail(createdByEmail);
          reservation.setCreatedBy(createdBy);
      } else {
          // not authenticated user; set creator to be the reservation owner
          reservation.setCreatedBy(reservation.getCreatedFor());
      }

      reservation.setDate(request.getDate());
      reservation.setPersons(request.getPersons());
      reservation.setStatus(request.getStatus());
      reservation.setStatusValue(request.getStatus().getLabel());
      reservation.setTable(request.getTable());
      reservation.setTime(request.getTime());
      reservation.setDuration(request.getDuration());

      UUID cancellationUUID = UUID.randomUUID();
      reservation.setCancellationUUID(cancellationUUID.toString());

      List<Short> statuses = List.of(ReservationStatus.Confirmed.getLabel());

      Integer conflictsCount = reservationService.countConflictsIncludeStatuses(reservation, statuses);
      if (conflictsCount > 0) {
          // @todo: Improve this
          throw new IllegalArgumentException("Reservation exists for given date, time and table.");
      }

      if (inform == null || inform) {
        senderService.sendReservationCreated(reservation);
      }

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

      return ResponseEntity.ok().body(reservationService.getWithConflicts());
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
  public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Reservation reservation, @RequestParam(required = false) Boolean inform) throws Exception {
      Reservation current = reservationService.get(id);
      reservationPatcher.patch(current, reservation);
      reservationService.save(current);

      // change status if specified on request; Doing after patch and save so that the latest reservation data can be used.
      // @todo: Check for possibility to implement such functionality straight inside the entity
      if (reservation.getStatus() != null) {
          // check the status that the request is assigning to this reservation; Call respective method to change status.
          switch (reservation.getStatus()) {
              case ReservationStatus.Pending:
                  reservationService.pend(current);
                  break;
              case ReservationStatus.Cancelled:
                  reservationService.cancel(current);
                  break;
              case ReservationStatus.Booked:
                  reservationService.book(current);
                  break;
              case ReservationStatus.Completed:
                  reservationService.complete(current);
                  break;
              case ReservationStatus.Confirmed:
                  reservationService.confirm(current);
                  break;
              default:
                  // @todo: Improve this
                  throw new Exception("Reservation status not acceptable");
          }
      }

      if (inform == null || inform) {
          senderService.sendReservationEdited(current);
      }

      return ResponseEntity.ok().body(current);
  }

  @PostMapping("/{id}/confirm")
  public ResponseEntity<?> confirm(@PathVariable Long id, @RequestParam(required = false) Boolean inform) throws Exception {
      Reservation reservation = reservationService.get(id);
      reservationService.confirm(reservation);

      if (inform == null || inform) {
        senderService.sendReservationConfirmed(reservation);
      }
      return ResponseEntity.ok().build();
  }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, @RequestParam(required = false) Boolean inform) throws ResourceNotFoundException {
        Reservation reservation = reservationService.get(id);
        reservationService.cancel(reservation);

        if (inform == null || inform) {
            // @todo: Add reason form in client
            senderService.sendReservationCancelled(reservation, "Cancelled after customer request.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<?> book(@PathVariable Long id, @RequestParam(required = false) Boolean inform) throws Exception {
        Reservation reservation = reservationService.get(id);
        if (inform == null || inform) {
            reservationService.book(reservation);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, @RequestParam(required = false) Boolean inform) throws Exception {
        Reservation reservation = reservationService.get(id);
        if (inform == null || inform) {
            reservationService.complete(reservation);
        }
        return ResponseEntity.ok().build();
    }
}
