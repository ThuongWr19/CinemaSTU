package com.CinemaGO.backend.dto;

<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Data;

=======
import com.CinemaGO.backend.entities.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

>>>>>>> a31a7b4b4e5f92ce23ebe327a4f9d5a9e4e6527d
@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String roles;
}

