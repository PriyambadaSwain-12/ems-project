package com.ems.backend.controller;
import com.ems.backend.dto.request.DepartmentRequest;import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.entity.Department;import com.ems.backend.service.impl.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService svc;
    @GetMapping("/api/departments") public ResponseEntity<ApiResponse<List<Department>>> all(){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getAll()));}
    @PostMapping("/api/admin/departments") public ResponseEntity<ApiResponse<Department>> create(@RequestBody DepartmentRequest r){return ResponseEntity.ok(ApiResponse.ok("Created",svc.create(r.getName(),r.getDescription())));}
    @PutMapping("/api/admin/departments/{id}") public ResponseEntity<ApiResponse<Department>> update(@PathVariable Long id,@RequestBody DepartmentRequest r){return ResponseEntity.ok(ApiResponse.ok("Updated",svc.update(id,r.getName(),r.getDescription())));}
    @DeleteMapping("/api/admin/departments/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){svc.delete(id);return ResponseEntity.ok(ApiResponse.ok("Deleted",null));}
}
