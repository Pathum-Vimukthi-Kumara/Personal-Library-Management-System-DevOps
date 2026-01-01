package com.Personal_Libarary_Management_System.DevOps_Project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"}, allowCredentials = "true")
public class LoginController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
            if (userOpt.isPresent() && userService.authenticate(request.getUsername(), request.getPassword())) {
                User user = userOpt.get();
                String token = jwtUtil.generateToken(user.getUsername(), user.getId());
                return ResponseEntity.ok(new LoginResponse("Login successful", token, user.getId(), user.getUsername()));
            } else {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid username or password"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse("Username already exists"));
            }
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse("Email already exists"));
            }
            
            userService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
            return ResponseEntity.ok(new ApiResponse("Registration successful"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Registration failed"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }
            
            Long userId = jwtUtil.extractUserId(jwt);
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(new UserProfile(user.getId(), user.getUsername(), user.getEmail()));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse("User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error fetching profile"));
        }
    }
}
