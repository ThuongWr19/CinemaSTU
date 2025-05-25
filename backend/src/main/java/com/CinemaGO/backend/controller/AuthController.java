package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.dto.AuthResponse;
import com.CinemaGO.backend.dto.LoginRequest;
import com.CinemaGO.backend.dto.RegisterRequest;
import com.CinemaGO.backend.entities.User;
import com.CinemaGO.backend.services.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Người dùng đang đăng nhập: " + loginRequest.getUsername());

            if (loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty() ||
                    loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Tên đăng nhập và mật khẩu không được để trống");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error: ", e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Đăng nhập thất bại: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Registration attempt for username: " + registerRequest.getUsername() +
                    ", email: " + registerRequest.getEmail());

            if (registerRequest.getUsername() == null || registerRequest.getUsername().isEmpty() ||
                    registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty() ||
                    registerRequest.getEmail() == null || registerRequest.getEmail().isEmpty() ||
                    registerRequest.getFullName() == null || registerRequest.getFullName().isEmpty()) {

                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Tất cả các trường thông tin đều là bắt buộc");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            User user = authService.register(registerRequest);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Đăng ký thành công");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            log.error("Error: ", e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Đăng ký thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}