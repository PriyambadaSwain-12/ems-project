package com.ems.backend.controller;
import com.ems.backend.dto.request.AttendanceRequest;import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.entity.Attendance;import com.ems.backend.service.impl.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;import java.util.*;
@RestController @RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService svc;
    @PostMapping("/api/admin/attendance") public ResponseEntity<ApiResponse<Attendance>> mark(@RequestBody AttendanceRequest r){return ResponseEntity.ok(ApiResponse.ok("Marked",svc.mark(r)));}
    @GetMapping("/api/admin/attendance/employee/{id}") public ResponseEntity<ApiResponse<List<Attendance>>> byEmp(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getByEmployee(id)));}
    @GetMapping("/api/admin/attendance/date/{date}") public ResponseEntity<ApiResponse<List<Attendance>>> byDate(@PathVariable @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getByDate(date)));}
    @GetMapping("/api/admin/attendance/summary/{id}") public ResponseEntity<ApiResponse<Map<String,Long>>> summary(@PathVariable Long id,@RequestParam int month,@RequestParam int year){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getSummary(id,month,year)));}
    @GetMapping("/api/employee/attendance") public ResponseEntity<ApiResponse<List<Attendance>>> mine(@AuthenticationPrincipal UserDetails u){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getMine(u.getUsername())));}
}
