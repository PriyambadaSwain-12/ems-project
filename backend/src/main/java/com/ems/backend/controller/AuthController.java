package com.ems.backend.controller;
import com.ems.backend.dto.request.*;import com.ems.backend.dto.response.*;
import com.ems.backend.service.impl.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService svc;
    @PostMapping("/login") public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest r){return ResponseEntity.ok(ApiResponse.ok("Login successful",svc.login(r)));}
    @PostMapping("/register") public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest r){return ResponseEntity.ok(ApiResponse.ok("Registered",svc.register(r)));}
}
