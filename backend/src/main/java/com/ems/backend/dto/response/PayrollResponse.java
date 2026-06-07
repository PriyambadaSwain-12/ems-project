package com.ems.backend.dto.response;
import lombok.*;import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PayrollResponse{
    private Long id,employeeId;
    private String employeeName,empCode,departmentName,designation;
    private int month,year,presentDays,workingDays;
    private Double basicSalary,hra,da,totalEarnings,pfDeduction,taxDeduction,lossOfPayDeduction,totalDeductions,netSalary;
    private LocalDate generatedDate;
}
