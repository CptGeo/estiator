package com.kalyvianakis.estiator.io.utils.config;

import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class SimpleMailMessageExt extends SimpleMailMessage {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername("g.kalyvianakis.dev@gmail.com");
        mailSender.setPassword("yzttyijspgudpdml");

        Properties props = mailSender.getJavaMailProperties();

        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        return mailSender;
    }

    @Bean
    public SimpleMailMessage templateCreateReservation() {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Hello %s,\n\nA new reservation in %s has been created for you!\n\n" +
                "Below you can find more details about your reservation: \n\nDate: %s\nFrom: %s\nUntil: %s\nTable preference: %s\nPersons: %d\n\n" +
                "Please note that the reservation is not yet finalized. Our staff will soon confirm it, so please wait.\n\n\n" +
                "If you would like to cancel this reservation, you can click the link below:\n" +
                "http://estiator.io");

        return message;
    }

    @Bean
    public SimpleMailMessage templateConfirmReservation() {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Hello %s,\n\nYour reservation in %s has be confirmed!\n\n" +
                "Below you can find the final details of your reservation: \n\nDate: %s\nFrom: %s\nUntil: %s\nTable preference: %s\nPersons: %d\n\n\n" +
                "If you would like to cancel this reservation, you can click the link below:\n" +
                "http://estiator.io");

        return message;
    }

    @Bean
    public SimpleMailMessage templateCancelReservation() {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Hello %s,\n\nYour reservation in %s has be cancelled!\n\n" +
                "The reservation with the below details has been cancelled: \n\nDate: %s\nFrom: %s\nUntil: %s\nTable preference: %s\nPersons: %d\n\n\n" +
                "The reason for cancellation is: \n\n%s");

        return message;
    }

    @Bean
    public SimpleMailMessage templateEditReservation() {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Hello %s,\n\nYour reservation info in %s have been updated.\n\n" +
                "Some information regarding your reservation have been changed. Below you can find the updated reservation details: \n\nStatus: %s\nDate: %s\nFrom: %s\nUntil: %s\nTable preference: %s\nPersons: %d\n\n\n" +
                "If you would like to cancel this reservation, you can click the link below:\n" +
                "http://estiator.io");

        return message;
    }

    @Bean
    public SimpleMailMessage templateCreateUser() {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Hello %s,\n\nWelcome to %s!\nYour account has been created successfully.");

        return message;
    }
}
