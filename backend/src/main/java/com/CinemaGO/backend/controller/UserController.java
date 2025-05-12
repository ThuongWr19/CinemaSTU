package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.dto.UserDTO;
import com.CinemaGO.backend.entities.Roles;
import com.CinemaGO.backend.entities.User;
import com.CinemaGO.backend.repositories.RoleRepository;
import com.CinemaGO.backend.repositories.UserRepository;
import org.apache.catalina.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

