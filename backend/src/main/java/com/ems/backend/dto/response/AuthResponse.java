package com.ems.backend.dto.response;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse{private String token,role,name,email;private Long userId,employeeId;private String profilePhoto;}
