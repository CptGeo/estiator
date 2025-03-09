package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.dto.TableAvailability;
import com.kalyvianakis.estiator.io.dto.TableIDResponse;
import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.repository.ReservationRepository;
import com.kalyvianakis.estiator.io.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TableService implements ITableService {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public Table save(Table table) {
        return tableRepository.save(table);
    }

    @Override
    public List<Table> get() {
        return tableRepository.findAll();
    }

    @Override
    public Table get(Long id) throws ResourceNotFoundException {
        return tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found for ID: " + id));
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        Table table = tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found for ID: " + id));

        List<Reservation> reservations = table.getReservations();

        // Iterate through table reservations and set table reference to null
        for (Reservation reservation: reservations) {
            reservation.setTable(null);
        }

        reservationRepository.saveAll(reservations);
        tableRepository.deleteById(id);
    }

    public Long isOccupied(Table table) {
        return tableRepository.isOccupied(table.getId());
    }

    public Long getTotalCapacity() {
        return tableRepository.getTotalCapacity();
    }

    @Override
    public Boolean exists(Long id) {
        return tableRepository.existsById(id);
    }

    @Override
    public Boolean notExists(Long id) {
        return !this.exists(id);
    }

    public Long count() { return tableRepository.count(); }

    public List<Table> getFreeByDateAndTimeAndDuration(LocalDate date, LocalTime time, Integer duration) {
        return tableRepository.getFreeByDateAndTimeAndDuration(date, time, duration);
    }

    public List<Table> getFreeAndAvailableByDateAndTimeAndDuration(LocalDate date, LocalTime time, Integer duration) {
        List<Short> excludeStatuses = List.of(ReservationStatus.Confirmed.getLabel(), ReservationStatus.Booked.getLabel());
        return tableRepository.getFreeByDateAndTimeAndDurationExcludeStatus(date, time, duration, excludeStatuses);
    }

    public TableIDResponse convertToTableIDResponse(Table table) {
        TableIDResponse t = new TableIDResponse();
        t.setId(table.getId());
        return t;
    }

    public List<TableAvailability> getAllWithAvailability(LocalDate date, LocalTime time, int duration) {
        List<Short> statuses = List.of(ReservationStatus.Confirmed.getLabel(), ReservationStatus.Booked.getLabel());
        List<Object[]> results = tableRepository.getAllWithAvailability(date, time, duration, statuses);

        return results.stream()
                .map(obj -> new TableAvailability(
                        ((Number) obj[0]).longValue(),
                        (String) obj[1],
                        ((Number) obj[2]).intValue(),
                        ((Number) obj[3]).intValue(),
                        ((Number) obj[4]).intValue(),
                        (String) obj[5],
                        ((Number) obj[6]).longValue() != 0
                ))
                .collect(Collectors.toList());
    }
}
