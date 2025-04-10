package com.kalyvianakis.estiator.io.service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import com.kalyvianakis.estiator.io.dto.AuthenticatedUser;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.repository.ReservationRepository;

@Service
public class ReservationService implements IReservationService {

  @Autowired
  ReservationRepository reservationRepository;

  @Override
  public Reservation save(Reservation reservation) {
    return reservationRepository.save(reservation);
  }

  @Override
  public List<Reservation> get() {
    return reservationRepository.findAll();
  }

  public List<Reservation> getWithConflicts() {
    List<Reservation> reservations = reservationRepository.findAll();
    reservations.forEach(reservation -> {

      List<ReservationStatus> excluded = List.of(ReservationStatus.Completed, ReservationStatus.Cancelled);
      if (excluded.contains(reservation.getStatus())) {
        reservation.setConflicts(0);
        return;
      }
      List<Short> included = List.of(ReservationStatus.Pending.getLabel(), ReservationStatus.Booked.getLabel(), ReservationStatus.Confirmed.getLabel());
      reservation.setConflicts(countConflictsIncludeStatuses(reservation, included));
    });
    return reservations;
  }

  public Integer countConflicts(Reservation reservation) {
    Long tableId = reservation.getTable() != null ? reservation.getTable().getId() : -1;
    List<Short> ignoreWithStatuses = List.of(ReservationStatus.Completed.getLabel(), ReservationStatus.Cancelled.getLabel());

    return reservationRepository.countConflicts(
            reservation.getId(),
            reservation.getDate(),
            reservation.getTime(),
            reservation.getDuration(),
            tableId);
  }

  public Integer countConflictsIncludeStatuses(Reservation reservation, List<Short> statuses) {
    Long tableId = reservation.getTable() != null ? reservation.getTable().getId() : -1;
    return reservationRepository.countConflictsIncludeStatuses(reservation.getId(), reservation.getDate(), reservation.getTime(), reservation.getDuration(), tableId, statuses);
  }

  @Override
  public Reservation get(Long id) throws ResourceNotFoundException {
    return reservationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation not found for ID: " + id));
  }

  public Reservation get(String cancellationUUID) {
    return reservationRepository.findByCancellationUUID(cancellationUUID);
  }

  public Long getCount() {
    return reservationRepository.count();
  }

  public Long getCountByDateLessThanEqual(LocalDate date) {
    return reservationRepository.countByDateLessThanEqual(date);
  }

  public Long getCountByDateBetween(LocalDate from, LocalDate to) {
    return reservationRepository.countByDateBetween(from, to);
  }

  @Override
  public void delete(Long id) {
    reservationRepository.deleteById(id);
  }

  @Override
  public Boolean exists(Long id) {
    return reservationRepository.existsById(id);
  }
  public Boolean exists(String cancellationUUID) { return reservationRepository.existsByCancellationUUID(cancellationUUID); }

  @Override
  public Boolean notExists(Long id) {
    return !this.exists(id);
  }

  public void confirm(Reservation reservation) throws Exception {
    // only reservations of the below statuses will be checked for conflicts of date, time and table.
    List<Short> conflictStatuses = List.of(ReservationStatus.Confirmed.getLabel(), ReservationStatus.Booked.getLabel());

    Integer conflictsCount = countConflictsIncludeStatuses(reservation, conflictStatuses);

    if (conflictsCount > 0) {
      // @todo: Improve this
      throw new Exception("Reservation with ID:" + reservation.getId() + " cannot be set to \"Confirmed\" due to conflicts");
    }

    reservation.setStatus(ReservationStatus.Confirmed);
    reservation.setStatusValue(ReservationStatus.Confirmed.getLabel());
    reservationRepository.save(reservation);
  }

  public void cancel(Reservation reservation) throws ResourceNotFoundException {
    reservation.setStatus(ReservationStatus.Cancelled);
    reservation.setStatusValue(ReservationStatus.Cancelled.getLabel());
    reservationRepository.save(reservation);
  }

  public void book(Reservation reservation) throws Exception {
    List<Short> conflictStatuses = List.of(ReservationStatus.Confirmed.getLabel(), ReservationStatus.Booked.getLabel());

    Integer conflictsCount = countConflictsIncludeStatuses(reservation, conflictStatuses);

    if (conflictsCount > 0) {
      // @todo: Improve this
      throw new Exception("Reservation with ID:" + reservation.getId() + " cannot be set to \"Confirmed\" due to conflicts");
    }

    if (reservation.getTable() == null) {
      // @todo: Improve this
      throw new Exception("Reservation must have an assigned table before it can be set to \"Booked\"");
    }

    reservation.setStatus(ReservationStatus.Booked);
    reservation.setStatusValue(ReservationStatus.Booked.getLabel());
    reservationRepository.save(reservation);
  }

  public void complete(Reservation reservation) throws Exception {
    if (reservation.getStatus() != ReservationStatus.Booked) {
      // @todo: Improve this
      throw new Exception("Reservation must be in status \"Booked\" before it can be set to \"Completed\"");
    }
    reservation.setStatus(ReservationStatus.Completed);
    reservation.setStatusValue(ReservationStatus.Completed.getLabel());
    reservationRepository.save(reservation);
  }

  public void pend(Reservation reservation) throws Exception {
    reservation.setStatus(ReservationStatus.Pending);
    reservation.setStatusValue(ReservationStatus.Pending.getLabel());
    reservationRepository.save(reservation);
  }

  public Collection<Reservation> getAllByUser(Long id) {
    return reservationRepository.findAllByCreatedForId(id);
  }
}
