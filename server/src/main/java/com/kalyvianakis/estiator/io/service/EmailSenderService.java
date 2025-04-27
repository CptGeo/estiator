package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.dto.SignupRequest;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.utils.config.SimpleMailMessageExt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TableService tableService;

    @Autowired
    public SimpleMailMessageExt simpleMailMessage;

    @Autowired
    public SettingService settingService;

    private void sendMessage(String to, String from, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message);
        } catch (MailException e) {
            System.err.println(e.getMessage());
        }
    }

    public void sendReservationCreated(Reservation reservation) throws ResourceNotFoundException {
        String tableLabel = tableService.get(reservation.getTable().getId()).getLabel();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy").localizedBy(Locale.ENGLISH);
        String text = String.format(
                simpleMailMessage.templateCreateReservation().getText(),
                reservation.getCreatedFor().getName() + " " + reservation.getCreatedFor().getSurname(),
                "Estiator.io",
                reservation.getDate().format(formatter),
                reservation.getTime().toString(),
                reservation.getTime().plusSeconds(reservation.getDuration()).toString(),
                tableLabel,
                reservation.getPersons(),
                reservation.getCancellationUUID()
        );

        this.sendMessage(
                reservation.getCreatedFor().getEmail(),
                "Estiator.io",
                "Estiator.io - A new reservation has been created for you.",
                text
        );
    }

    public void sendReservationConfirmed(Reservation reservation) throws ResourceNotFoundException {
        String tableLabel = tableService.get(reservation.getTable().getId()).getLabel();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy").localizedBy(Locale.ENGLISH);
        String text = String.format(
                simpleMailMessage.templateConfirmReservation().getText(),
                reservation.getCreatedFor().getName() + " " + reservation.getCreatedFor().getSurname(),
                "Estiator.io",
                reservation.getDate().format(formatter),
                reservation.getTime().toString(),
                reservation.getTime().plusSeconds(reservation.getDuration()).toString(),
                tableLabel,
                reservation.getPersons(),
                reservation.getCancellationUUID()
        );

        this.sendMessage(
                reservation.getCreatedFor().getEmail(),
                "Estiator.io",
                "Estiator.io - Your reservation has been confirmed.",
                text
        );
    }

    public void sendReservationCancelled(Reservation reservation, String reason) throws ResourceNotFoundException {
        String tableLabel = tableService.get(reservation.getTable().getId()).getLabel();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy").localizedBy(Locale.ENGLISH);
        String text = String.format(
                simpleMailMessage.templateCancelReservation().getText(),
                reservation.getCreatedFor().getName() + " " + reservation.getCreatedFor().getSurname(),
                "Estiator.io",
                reservation.getDate().format(formatter),
                reservation.getTime().toString(),
                reservation.getTime().plusSeconds(reservation.getDuration()).toString(),
                tableLabel,
                reservation.getPersons(),
                reason
        );

        this.sendMessage(
                reservation.getCreatedFor().getEmail(),
                "Estiator.io",
                "Estiator.io - Your reservation has been cancelled.",
                text
        );
    }

    public void sendReservationEdited(Reservation reservation) throws ResourceNotFoundException {
        String tableLabel = tableService.get(reservation.getTable().getId()).getLabel();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy").localizedBy(Locale.ENGLISH);
        String text = String.format(
                simpleMailMessage.templateEditReservation().getText(),
                reservation.getCreatedFor().getName() + " " + reservation.getCreatedFor().getSurname(),
                "Estiator.io",
                reservation.getStatus().toString(),
                reservation.getDate().format(formatter),
                reservation.getTime().toString(),
                reservation.getTime().plusSeconds(reservation.getDuration()).toString(),
                tableLabel,
                reservation.getPersons(),
                reservation.getCancellationUUID()
        );

        this.sendMessage(
                reservation.getCreatedFor().getEmail(),
                "Estiator.io",
                String.format("%s - Your reservation info have been updated.", "Estiator.io"),
                text
        );
    }

    public void sendReservationCompleted(Reservation reservation) {
        if (reservation.getCreatedFor().getPassword() == null) {
            return;
        }
        
        String text = String.format(
                simpleMailMessage.templateCompleteReservation().getText(),
                reservation.getCreatedFor().getName() + " " + reservation.getCreatedFor().getSurname(),
                "Estiator.io"
        );

        this.sendMessage(
                reservation.getCreatedFor().getEmail(),
                "Estiator.io",
                String.format("%s - Thank you for dining at our restaurant!", "Estiator.io"),
                text
        );
    }

    public void sendUserCreated(SignupRequest signupRequest) {
        String text = String.format(
                simpleMailMessage.templateCreateUser().getText(),
                signupRequest.getName() + " " + signupRequest.getSurname(),
                "Estiator.io"
        );

        this.sendMessage(
                signupRequest.getEmail(),
                "Estiator.io",
                String.format("%s - Your user account has been created successfully", "Estiator.io"),
                text
        );
    }

}
