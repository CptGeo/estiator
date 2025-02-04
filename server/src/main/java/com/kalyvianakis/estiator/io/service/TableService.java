package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.dto.TableIDResponse;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.repository.ReservationRepository;
import com.kalyvianakis.estiator.io.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
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

    public List<TableIDResponse> getIdsFreeByDateAndTimeAndDuration(LocalDate date, LocalTime time, Integer duration) {
        List<Table> tables = tableRepository.getIdsFreeByDateAndTimeAndDuration(date, time, duration);
        return tables.stream().map(this::convertToTableIDResponse).collect(Collectors.toList());
    }

    public TableIDResponse convertToTableIDResponse(Table table) {
        TableIDResponse t = new TableIDResponse();
        t.setId(table.getId());
        return t;
    }
}
