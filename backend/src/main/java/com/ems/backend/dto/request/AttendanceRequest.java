package com.ems.backend.dto.request;
import lombok.Data;import java.time.LocalDate;
@Data public class AttendanceRequest{private Long employeeId;private LocalDate date;private String status,remarks;}
