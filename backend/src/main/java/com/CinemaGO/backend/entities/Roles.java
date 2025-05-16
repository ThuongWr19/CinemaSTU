package com.CinemaGO.backend.entities;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
=======
>>>>>>> a31a7b4b4e5f92ce23ebe327a4f9d5a9e4e6527d
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

<<<<<<< HEAD
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<User> users;

=======
    private String name; // ví dụ: "ADMIN", "USER"

    @OneToMany(mappedBy = "role")
    private List<User> users;
>>>>>>> a31a7b4b4e5f92ce23ebe327a4f9d5a9e4e6527d
}
