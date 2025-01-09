package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.UserPatcher;
import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("users")
@SuppressWarnings("unused")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserPatcher userPatcher;

    @PostMapping
    // @todo - Fix issue with entity creation. Instead of 400 - Bad Request, I get 500 - Internal Server Error after data validation with 'false' result
    public ResponseEntity<User> add(@RequestBody User user) {
        user.setStatusValue(user.getStatus().getLabel());

        return ResponseEntity.ok().body(userService.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.get(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<?> getSchedule(@PathVariable Integer id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.getSchedule(id));
    }

    @GetMapping()
    public ResponseEntity<List<User>> get(@RequestParam(required = false, name = "registered") Boolean registered) {
        if (registered != null) {
            if (registered) {
                return ResponseEntity.ok().body(userService.getRegistered());
            } else {
                return ResponseEntity.ok().body(userService.getNotRegistered());
            }
        }

        return ResponseEntity.ok().body(userService.get());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> get(@PathVariable String email) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(userService.getOneByEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws ResourceNotFoundException, IllegalArgumentException {
        if(userService.notExists(id)) {
            throw new ResourceNotFoundException("User not found for ID: " + id);
        }

        userService.delete(id);
        MessageResponse response = new MessageResponse("Resource deleted for ID: " + id);
        return ResponseEntity.ok().body(response);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Integer id, @RequestBody User user) throws ResourceNotFoundException, IllegalArgumentException {
        User current = userService.get(id);

        userPatcher.patch(current, user);
        userService.save(current);

        return ResponseEntity.ok().body(current);
    }
}
