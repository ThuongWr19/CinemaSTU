package com.CinemaSTU.backend.controller;

import com.CinemaSTU.backend.dto.UserDTO;
import com.CinemaSTU.backend.entities.Roles;
import com.CinemaSTU.backend.entities.User;
import com.CinemaSTU.backend.repositories.RoleRepository;
import com.CinemaSTU.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserDTO> result = users.stream().map(u ->
                new UserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getRole().getName()
                )
        ).toList();

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        user.setUsername(updatedUser.getUsername());
        Roles newRole = roleRepository.findByName(updatedUser.getRoles())
                .orElseThrow(() -> new RuntimeException("Vai trò không hợp lệ"));

        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật thành công");
    }


}

