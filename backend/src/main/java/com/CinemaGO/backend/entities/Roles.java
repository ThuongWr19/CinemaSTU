package com.CinemaGO.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Entity
@Table(name="roles")
public class Roles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // ví dụ: "ADMIN", "USER"

    @OneToMany(mappedBy = "role")
    private List<User> users;
}
