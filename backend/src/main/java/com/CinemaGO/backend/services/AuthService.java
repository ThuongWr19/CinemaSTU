package com.CinemaGO.backend.services;


import com.CinemaGO.backend.dto.AuthResponse;
import com.CinemaGO.backend.dto.LoginRequest;
import com.CinemaGO.backend.dto.RegisterRequest;
import com.CinemaGO.backend.entities.User;
import com.CinemaGO.backend.repositories.UserRepository;
import com.CinemaGO.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for: " + loginRequest.getUsername());

            // Check if user exists before authentication
            boolean userExists = userRepository.existsByUsername(loginRequest.getUsername());
            System.out.println("User exists in database: " + userExists);

            if (!userExists) {
                throw new UsernameNotFoundException("User not found: " + loginRequest.getUsername());
            }

            // Try to authenticate
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("Authentication successful for: " + loginRequest.getUsername());
            return new AuthResponse(jwt, user.getUsername(), user.getFullName());
        } catch (UsernameNotFoundException e) {
            System.out.println("Username not found: " + e.getMessage());
            throw e;
        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + loginRequest.getUsername());
            throw e;
        } catch (Exception e) {
            System.out.println("Authentication exception: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public User register(RegisterRequest registerRequest) {
        // Validate username
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Validate email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());

        return userRepository.save(user);
    }
}
