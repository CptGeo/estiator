package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.UserPatcher;
import com.kalyvianakis.estiator.io.enums.UserStatus;
import com.kalyvianakis.estiator.io.model.User;
import com.kalyvianakis.estiator.io.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<String> add(@RequestBody User user) {
        try {
            user.setStatusValue(user.getStatus().getLabel());
            userService.save(user);
            return ResponseEntity.ok().body("User has been added successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        try{ 
            User user = userService.get(id);
            if (user == null) {
                return ResponseEntity.badRequest().body("Resource not found for ID: " + id);
            }
            return ResponseEntity.ok().body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<List<User>> get() {
        return ResponseEntity.ok().body(userService.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            if(userService.notExists(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
            }
            
            userService.delete(id);
            return ResponseEntity.ok().body(String.format("Resource deleted for ID: ", id)); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Integer id, @RequestBody User user) {
        try {
            if (id == null || id < 0) {
                return ResponseEntity.badRequest().body("Invalid ID provided");
            }

            User current = userService.get(id);

            if(current == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
            }

            userPatcher.patch(current, user);
            userService.save(current);

            return ResponseEntity.ok().body(current);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
