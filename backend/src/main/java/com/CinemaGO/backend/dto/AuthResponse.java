package com.CinemaGO.backend.dto;

import com.CinemaGO.backend.entities.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private Roles role;
}