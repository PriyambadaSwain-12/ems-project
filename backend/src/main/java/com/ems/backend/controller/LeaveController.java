package com.ems.backend.controller;
import com.ems.backend.dto.request.*;import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.entity.LeaveRequest;import com.ems.backend.service.impl.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequiredArgsConstructor
public class LeaveController {
    private final LeaveService svc;
    @PostMapping("/api/employee/leaves") public ResponseEntity<ApiResponse<LeaveRequest>> apply(@RequestBody LeaveApplyRequest r,@AuthenticationPrincipal UserDetails u){return ResponseEntity.ok(ApiResponse.ok("Applied",svc.apply(r,u.getUsername())));}
    @GetMapping("/api/employee/leaves") public ResponseEntity<ApiResponse<List<LeaveRequest>>> mine(@AuthenticationPrincipal UserDetails u){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getMine(u.getUsername())));}
    @GetMapping("/api/admin/leaves") public ResponseEntity<ApiResponse<List<LeaveRequest>>> all(){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getAll()));}
    @GetMapping("/api/admin/leaves/pending") public ResponseEntity<ApiResponse<List<LeaveRequest>>> pending(){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getPending()));}
    @PutMapping("/api/admin/leaves/{id}/action") public ResponseEntity<ApiResponse<LeaveRequest>> action(@PathVariable Long id,@RequestBody LeaveActionRequest r){return ResponseEntity.ok(ApiResponse.ok("Done",svc.action(id,r)));}
}
