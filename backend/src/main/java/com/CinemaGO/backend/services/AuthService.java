package com.CinemaGO.backend.services;


import com.CinemaGO.backend.dto.AuthResponse;
import com.CinemaGO.backend.dto.LoginRequest;
import com.CinemaGO.backend.dto.RegisterRequest;
import com.CinemaGO.backend.entities.Roles;
import com.CinemaGO.backend.entities.User;
import com.CinemaGO.backend.repositories.RoleRepository;
import com.CinemaGO.backend.repositories.UserRepository;
import com.CinemaGO.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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

    @Autowired
    private RoleRepository roleRepository;

    public AuthResponse login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        try {
            System.out.println("Login attempt for: " + username);

            boolean userExists = userRepository.existsByUsername(username);
            System.out.println("User exists in database: " + userExists);

            if (!userExists) {
                System.out.println("User not found: " + username);
                throw new UsernameNotFoundException("User not found: " + username);
            }

            User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            System.out.println("Found user: " + user.getUsername());
            //  IMPORTANT:  Remove this in production!
            System.out.println("Password from DB (first 10 chars): " +
                    (user.getPassword().length() > 10 ?
                            user.getPassword().substring(0, 10) + "..." :
                            "too short"));

            Authentication authentication = null;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                username,
                                loginRequest.getPassword()
                        )
                );
                System.out.println("Authentication successful for: " + username);
            } catch (BadCredentialsException e) {
                System.err.println("Bad credentials for user: " + username + ": " + e.getMessage());
                throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu", e); //  Wrap and rethrow
            } catch (DisabledException e) {
                System.err.println("Account is disabled for user: " + username + ": " + e.getMessage());
                throw new RuntimeException("Tài khoản bị vô hiệu hóa", e);
            } catch (LockedException e) {
                System.err.println("Account is locked for user: " + username + ": " + e.getMessage());
                throw new RuntimeException("Tài khoản bị khóa", e);
            } catch (AuthenticationException e) {
                System.err.println("Authentication failed for user: " + username + ": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Đăng nhập thất bại", e);
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            return new AuthResponse(jwt, user.getUsername(), user.getFullName(), user.getRole().getName());


        } catch (UsernameNotFoundException e) {
            System.out.println("Username not found: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) { //  Catch our wrapped exceptions
            System.err.println("Login error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error during login: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi không xác định", e);  //  Wrap and rethrow
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
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));  // This is correct
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        Roles defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Vai trò USER không tồn tại"));

        user.setRole(defaultRole);

        return userRepository.save(user);
    }
}
