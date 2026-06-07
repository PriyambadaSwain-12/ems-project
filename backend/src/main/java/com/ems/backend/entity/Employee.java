package com.ems.backend.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDate;
@Entity @Table(name="employees") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch=FetchType.EAGER) @JoinColumn(name="user_id") private User user;
    @Column(unique=true) private String empCode;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="department_id") private Department department;
    private String designation;
    private LocalDate joiningDate;
    private String phone;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    @Column(nullable=false) @Builder.Default private Double basicSalary=0.0;
    @Column(columnDefinition="MEDIUMTEXT") private String profilePhoto;
}
