package com.ems.backend.dto.response;
import lombok.*;import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeResponse{
    private Long id,departmentId;
    private String empCode,name,email,departmentName,designation,phone,address,gender;
    private Double basicSalary;private LocalDate joiningDate,dateOfBirth;private String profilePhoto;
}
