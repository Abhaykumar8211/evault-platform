package com.evault.auth;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.auth.dto.DemoLoginRequest;
import com.evault.auth.dto.JwtResponse;
import com.evault.auth.dto.LoginRequest;
import com.evault.auth.dto.RegisterRequest;
import com.evault.auth.dto.UserProfileResponse;
import com.evault.common.BadRequestException;
import com.evault.common.ResourceNotFoundException;
import com.evault.common.UnauthorizedException;
import com.evault.user.User;
import com.evault.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.auditService = auditService;
    }

    @Transactional
    public JwtResponse login(LoginRequest request, HttpServletRequest servletRequest) {
        String clientIp = getClientIp(servletRequest);
        String userAgent = servletRequest.getHeader("User-Agent");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User record not found"));

            auditService.recordEvent(
                    AuditEventType.LOGIN,
                    user,
                    "USER",
                    user.getId(),
                    "User logged in successfully via web portal",
                    clientIp,
                    userAgent,
                    "SUCCESS"
            );

            return JwtResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .id(userDetails.getId())
                    .email(userDetails.getEmail())
                    .fullName(userDetails.getFullName())
                    .role(userDetails.getRole())
                    .badgeNumber(userDetails.getBadgeNumber())
                    .department(userDetails.getDepartment())
                    .build();

        } catch (Exception e) {
            auditService.recordEvent(
                    AuditEventType.LOGIN_FAILED,
                    null,
                    "USER",
                    null,
                    "Failed login attempt for email: " + request.getEmail() + " - " + e.getMessage(),
                    clientIp,
                    userAgent,
                    "FAILED"
            );
            throw e;
        }
    }

    @Transactional
    public JwtResponse demoLogin(DemoLoginRequest request, HttpServletRequest servletRequest) {
        String roleKey = request.getRole() != null ? request.getRole().trim().toLowerCase() : "";
        String demoEmail;
        switch (roleKey) {
            case "judge":
                demoEmail = "judge@evault.demo";
                break;
            case "officer":
            case "investigating_officer":
                demoEmail = "officer@evault.demo";
                break;
            case "prosecutor":
                demoEmail = "prosecutor@evault.demo";
                break;
            case "lawyer":
                demoEmail = "lawyer@evault.demo";
                break;
            case "admin":
            case "super_admin":
                demoEmail = "admin@evault.demo";
                break;
            default:
                throw new BadRequestException("Invalid demo role: " + request.getRole());
        }

        LoginRequest loginReq = new LoginRequest(demoEmail, "Password@123");
        return login(loginReq, servletRequest);
    }

    @Transactional
    public UserProfileResponse register(RegisterRequest request, HttpServletRequest servletRequest) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Error: Email address is already in use: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role(request.getRole())
                .badgeNumber(request.getBadgeNumber())
                .department(request.getDepartment())
                .phone(request.getPhone())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        String clientIp = getClientIp(servletRequest);
        String userAgent = servletRequest.getHeader("User-Agent");

        auditService.recordEvent(
                AuditEventType.USER_REGISTERED,
                savedUser,
                "USER",
                savedUser.getId(),
                "New user registered with role: " + savedUser.getRole().name(),
                clientIp,
                userAgent,
                "SUCCESS"
        );

        return mapToProfileResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        return mapToProfileResponse(user);
    }

    public void logout(HttpServletRequest servletRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            userRepository.findById(userDetails.getId()).ifPresent(user -> {
                auditService.recordEvent(
                        AuditEventType.LOGOUT,
                        user,
                        "USER",
                        user.getId(),
                        "User logged out",
                        getClientIp(servletRequest),
                        servletRequest.getHeader("User-Agent"),
                        "SUCCESS"
                );
            });
        }
        SecurityContextHolder.clearContext();
    }

    public UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .roleDisplayName(user.getRole().getDisplayName())
                .badgeNumber(user.getBadgeNumber())
                .department(user.getDepartment())
                .phone(user.getPhone())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(",")) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
