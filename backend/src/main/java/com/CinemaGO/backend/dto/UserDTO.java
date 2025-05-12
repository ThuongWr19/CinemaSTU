package com.CinemaGO.backend.dto;

import com.CinemaGO.backend.entities.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String roles;
}

