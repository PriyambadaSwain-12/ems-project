package com.ems.backend.service.impl;
import com.ems.backend.dto.request.*;
import com.ems.backend.dto.response.AuthResponse;
import com.ems.backend.entity.*;
import com.ems.backend.enums.Role;
import com.ems.backend.exception.BadRequestException;
import com.ems.backend.repository.*;
import com.ems.backend.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;private final EmployeeRepository empRepo;
    private final PasswordEncoder enc;private final AuthenticationManager authMgr;
    private final JwtUtil jwt;private final UserDetailsServiceImpl uds;
    public AuthResponse login(LoginRequest r){
        authMgr.authenticate(new UsernamePasswordAuthenticationToken(r.getEmail(),r.getPassword()));
        var u=userRepo.findByEmail(r.getEmail()).orElseThrow(()->new BadRequestException("User not found"));
        var ud=uds.loadUserByUsername(r.getEmail());
        String token=jwt.generate(ud,u.getRole().name());
        Long empId=empRepo.findByUserId(u.getId()).map(Employee::getId).orElse(null);
        String photo=empRepo.findByUserId(u.getId()).map(Employee::getProfilePhoto).orElse(null);
        return AuthResponse.builder().token(token).role(u.getRole().name())
            .name(u.getName()).email(u.getEmail()).userId(u.getId()).employeeId(empId).profilePhoto(photo).build();
    }
    public AuthResponse register(RegisterRequest r){
        if(userRepo.existsByEmail(r.getEmail()))throw new BadRequestException("Email already registered");
        Role role=r.getRole()!=null?Role.valueOf(r.getRole().toUpperCase()):Role.EMPLOYEE;
        var u=userRepo.save(User.builder().name(r.getName()).email(r.getEmail())
            .password(enc.encode(r.getPassword())).role(role).active(true).build());
        var ud=uds.loadUserByUsername(u.getEmail());
        return AuthResponse.builder().token(jwt.generate(ud,role.name())).role(role.name())
            .name(u.getName()).email(u.getEmail()).userId(u.getId()).build();
    }
}
