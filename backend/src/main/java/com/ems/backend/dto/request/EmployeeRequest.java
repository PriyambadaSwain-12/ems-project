package com.ems.backend.dto.request;
import lombok.Data;import java.time.LocalDate;
@Data public class EmployeeRequest{
    private String name,email,password,designation,phone,address,gender,profilePhoto;
    private Long departmentId;private Double basicSalary;private LocalDate joiningDate,dateOfBirth;
}
