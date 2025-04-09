package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.UserPatcher;
import com.kalyvianakis.estiator.io.dto.AuthenticatedUser;
import com.kalyvianakis.estiator.io.dto.SafeUserData;
import com.kalyvianakis.estiator.io.enums.ScheduleStatus;
import com.kalyvianakis.estiator.io.service.EmailSenderService;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.model.ScheduleRequest;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.ScheduleService;
import com.kalyvianakis.estiator.io.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@CrossOrigin
@RequestMapping("users")
@SuppressWarnings("unused")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private UserPatcher userPatcher;

    @Autowired
    private EmailSenderService senderService;

    @PostMapping
    // @todo - Fix issue with entity creation. Instead of 400 - Bad Request, I get 500 - Internal Server Error after data validation with 'false' result
    public ResponseEntity<User> add(@RequestBody User user) {
        if (user.getStatus() != null) {
            user.setStatusValue(user.getStatus().getLabel());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal AuthenticatedUser user) throws Exception {
        if (user == null) {
            throw new Exception("User is not authenticated");
        }

        return ResponseEntity.ok().body(userService.get(user.getId()));
    }

    @PatchMapping("/me")
    public ResponseEntity<AuthenticatedUser> patchMe(@AuthenticationPrincipal AuthenticatedUser authUser, @RequestBody(required = true) User user) throws Exception {
        if (authUser == null || (authUser.getId() != user.getId())) {
            throw new Exception("User is not authenticated");
        }

        User current = userService.get(user.getId());

        userPatcher.patch(current, user);
        userService.save(current);

        return ResponseEntity.ok().body(new SafeUserData(current));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWithRoles(@PathVariable Long id, @RequestParam(required = false, name = "roles") Collection<String> roles) throws ResourceNotFoundException {
        if (roles != null && roles.stream().count() > 0) {
            return ResponseEntity.ok().body(userService.getWithRoles(id, roles));
        }
        return ResponseEntity.ok().body(userService.get(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<?> getSchedule(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.getSchedule(id));
    }

    @GetMapping("/{id}/schedule/{date}")
    public ResponseEntity<Schedule> getScheduleByDate(@PathVariable Long id, @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.getScheduleByDate(id, date));
    }

    @PostMapping("/{id}/schedules")
    public ResponseEntity<?> addSchedule(@PathVariable Long id, @RequestBody ScheduleRequest scheduleRequest) throws ResourceNotFoundException {
        LocalDate startDate = scheduleRequest.getStartDate();
        LocalDate endDate = scheduleRequest.getEndDate();
        Time startTime = scheduleRequest.getStartTime();
        Time endTime = scheduleRequest.getEndTime();
        ScheduleStatus status = scheduleRequest.getStatus();

        // List of existing schedules
        List<Schedule> existing = scheduleService.getByUserIdAndDateRange(id, startDate, endDate);

        User user = userService.get(id);

        // create a set for easy lookup of the whole collection
        Set<LocalDate> existingDates = existing.stream().map(Schedule::getDate).collect(Collectors.toSet());

        // update existing schedules
        for (Schedule schedule : existing) {
            schedule.setStartTime(startTime);
            schedule.setEndTime(endTime);
            schedule.setStatusValue(status.getLabel());
            schedule.setStatus(status);
        }

        List<Schedule> newSchedules = new ArrayList<>();
        LocalDate currentDate = scheduleRequest.getStartDate();

        while (!currentDate.isAfter(endDate)) {
            if (!existingDates.contains(currentDate)) {
                Schedule newSchedule = new Schedule();
                newSchedule.setDate(currentDate);
                newSchedule.setUser(user);
                newSchedule.setStartTime(startTime);
                newSchedule.setEndTime(endTime);
                newSchedule.setStatusValue(status.getLabel());
                newSchedule.setStatus(status);

                newSchedules.add(newSchedule);
            }

            currentDate = currentDate.plusDays(1);
        }

        List<Schedule> schedules = Stream.concat(
                scheduleService.saveAll(existing).stream(),
                scheduleService.saveAll(newSchedules).stream()).collect(Collectors.toList());

        return ResponseEntity.ok().body(schedules);
    }

    @GetMapping
    public ResponseEntity<List<User>> get(@RequestParam(required = false, name = "roles") Collection<String> roles) {
        if (roles != null && roles.stream().count() > 0) {
            return ResponseEntity.ok().body(userService.getByRoles(roles));
        }
        return ResponseEntity.ok().body(userService.get());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> get(@PathVariable String email) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.getOneByEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException, IllegalArgumentException {
        if(userService.notExists(id)) {
            throw new ResourceNotFoundException("User not found for ID: " + id);
        }

        userService.delete(id);
        MessageResponse response = new MessageResponse("Resource deleted for ID: " + id, "");
        return ResponseEntity.ok().body(response);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody User user) throws ResourceNotFoundException, IllegalArgumentException {
        User current = userService.get(id);

        userPatcher.patch(current, user);
        userService.save(current);

        return ResponseEntity.ok().body(new SafeUserData(current));
    }
}
