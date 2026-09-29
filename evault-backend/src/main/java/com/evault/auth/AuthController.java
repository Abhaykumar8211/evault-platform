package com.evault.auth;

import com.evault.auth.dto.DemoLoginRequest;
import com.evault.auth.dto.JwtResponse;
import com.evault.auth.dto.LoginRequest;
import com.evault.auth.dto.RegisterRequest;
import com.evault.auth.dto.UserProfileResponse;
import com.evault.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        JwtResponse jwtResponse = authService.login(loginRequest, request);
        return ResponseEntity.ok(ApiResponse.success(jwtResponse, "Login successful"));
    }

    @PostMapping("/demo-login")
    public ResponseEntity<ApiResponse<JwtResponse>> demoLogin(
            @Valid @RequestBody DemoLoginRequest demoLoginRequest,
            HttpServletRequest request) {
        JwtResponse jwtResponse = authService.demoLogin(demoLoginRequest, request);
        return ResponseEntity.ok(ApiResponse.success(jwtResponse, "SIH Demo login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(
            @Valid @RequestBody RegisterRequest registerRequest,
            HttpServletRequest request) {
        UserProfileResponse profileResponse = authService.register(registerRequest, request);
        return new ResponseEntity<>(ApiResponse.success(profileResponse, "User registered successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser() {
        UserProfileResponse profileResponse = authService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profileResponse, "Current user profile retrieved"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}
