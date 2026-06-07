package com.ems.backend.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDate;
@Entity @Table(name="payroll",uniqueConstraints=@UniqueConstraint(columnNames={"employee_id","month","year"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payroll {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="employee_id",nullable=false) private Employee employee;
    private int month,year;
    private Double basicSalary,hra,da,totalEarnings;
    private Double pfDeduction,taxDeduction,lossOfPayDeduction,totalDeductions,netSalary;
    private int presentDays,workingDays;
    private LocalDate generatedDate;
}
