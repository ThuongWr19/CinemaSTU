package com.CinemaGO.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;
    private String email;
    private String fullName;
    private String role = "USER";

    public void setPassword(String password) {
        this.password = new BCryptPasswordEncoder().encode(password);
    }
}
