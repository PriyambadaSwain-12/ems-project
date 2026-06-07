package com.ems.backend.controller;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.enums.LeaveStatus;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/admin/dashboard") @RequiredArgsConstructor
public class DashboardController {
    private final EmployeeRepository empRepo;private final DepartmentRepository deptRepo;private final LeaveRequestRepository leaveRepo;
    @GetMapping("/stats") public ResponseEntity<ApiResponse<Map<String,Object>>> stats(){
        Map<String,Object> m=new HashMap<>();
        m.put("totalEmployees",empRepo.count());m.put("totalDepartments",deptRepo.count());
        m.put("pendingLeaves",leaveRepo.findByStatus(LeaveStatus.PENDING).size());
        return ResponseEntity.ok(ApiResponse.ok("OK",m));
    }
}
