package com.ems.backend.controller;
import com.ems.backend.dto.request.EmployeeRequest;import com.ems.backend.dto.response.*;
import com.ems.backend.service.impl.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService svc;
    @GetMapping("/api/admin/employees") public ResponseEntity<ApiResponse<List<EmployeeResponse>>> all(){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getAll()));}
    @GetMapping("/api/admin/employees/{id}") public ResponseEntity<ApiResponse<EmployeeResponse>> byId(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getById(id)));}
    @PostMapping("/api/admin/employees") public ResponseEntity<ApiResponse<EmployeeResponse>> create(@RequestBody EmployeeRequest r){return ResponseEntity.ok(ApiResponse.ok("Created",svc.create(r)));}
    @PutMapping("/api/admin/employees/{id}") public ResponseEntity<ApiResponse<EmployeeResponse>> update(@PathVariable Long id,@RequestBody EmployeeRequest r){return ResponseEntity.ok(ApiResponse.ok("Updated",svc.update(id,r)));}
    @DeleteMapping("/api/admin/employees/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){svc.delete(id);return ResponseEntity.ok(ApiResponse.ok("Deleted",null));}
    @GetMapping("/api/employee/profile") public ResponseEntity<ApiResponse<EmployeeResponse>> myProfile(@AuthenticationPrincipal UserDetails u){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getMyProfile(u.getUsername())));}
    @PutMapping("/api/employee/profile") public ResponseEntity<ApiResponse<EmployeeResponse>> updateProfile(@AuthenticationPrincipal UserDetails u,@RequestBody EmployeeRequest r){
        var p=svc.getMyProfile(u.getUsername());return ResponseEntity.ok(ApiResponse.ok("Updated",svc.update(p.getId(),r)));}
}
