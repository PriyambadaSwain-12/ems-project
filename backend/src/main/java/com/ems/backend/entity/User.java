package com.ems.backend.entity;
import com.ems.backend.enums.Role;
import jakarta.persistence.*;import lombok.*;
@Entity @Table(name="users") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false,unique=true) private String email;
    @Column(nullable=false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
    @Builder.Default @Column(nullable=false) private boolean active=true;
}
