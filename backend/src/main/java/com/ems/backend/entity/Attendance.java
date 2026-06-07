package com.ems.backend.entity;
import com.ems.backend.enums.AttendanceStatus;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDate;
@Entity @Table(name="attendance",uniqueConstraints=@UniqueConstraint(columnNames={"employee_id","date"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="employee_id",nullable=false) private Employee employee;
    @Column(nullable=false) private LocalDate date;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private AttendanceStatus status;
    private String remarks;
}
