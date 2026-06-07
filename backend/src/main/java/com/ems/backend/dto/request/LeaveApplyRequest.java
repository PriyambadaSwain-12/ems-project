package com.ems.backend.dto.request;
import lombok.Data;import java.time.LocalDate;
@Data public class LeaveApplyRequest{private String type,reason;private LocalDate fromDate,toDate;}
