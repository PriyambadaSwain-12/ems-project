package com.ems.backend.controller;
import com.ems.backend.dto.request.PayrollRequest;import com.ems.backend.dto.response.*;
import com.ems.backend.service.impl.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequiredArgsConstructor
public class PayrollController {
    private final PayrollService svc;
    @PostMapping("/api/admin/payroll/generate") public ResponseEntity<ApiResponse<PayrollResponse>> gen(@RequestBody PayrollRequest r){return ResponseEntity.ok(ApiResponse.ok("Generated",svc.generate(r)));}
    @GetMapping("/api/admin/payroll") public ResponseEntity<ApiResponse<List<PayrollResponse>>> byMonth(@RequestParam int month,@RequestParam int year){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getByMonth(month,year)));}
    @GetMapping("/api/admin/payroll/employee/{id}") public ResponseEntity<ApiResponse<List<PayrollResponse>>> byEmp(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getByEmployee(id)));}
    @GetMapping("/api/employee/payroll") public ResponseEntity<ApiResponse<PayrollResponse>> mine(@AuthenticationPrincipal UserDetails u,@RequestParam int month,@RequestParam int year){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getMine(u.getUsername(),month,year)));}
    @GetMapping("/api/payroll/{id}/slip") public ResponseEntity<byte[]> slip(@PathVariable Long id){
        HttpHeaders h=new HttpHeaders();h.setContentType(MediaType.APPLICATION_PDF);
        h.setContentDispositionFormData("attachment","salary-slip-"+id+".pdf");
        return ResponseEntity.ok().headers(h).body(svc.pdf(id));
    }
}
