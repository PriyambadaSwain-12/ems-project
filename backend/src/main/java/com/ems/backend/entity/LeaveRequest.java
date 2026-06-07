package com.ems.backend.entity;
import com.ems.backend.enums.*;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDate;
@Entity @Table(name="leave_requests") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequest {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="employee_id",nullable=false) private Employee employee;
    @Enumerated(EnumType.STRING) private LeaveType type;
    @Column(nullable=false) private LocalDate fromDate;
    @Column(nullable=false) private LocalDate toDate;
    private String reason;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private LeaveStatus status=LeaveStatus.PENDING;
    private String adminComment;
}
