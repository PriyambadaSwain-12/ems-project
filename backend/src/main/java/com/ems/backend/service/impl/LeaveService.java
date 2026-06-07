package com.ems.backend.service.impl;
import com.ems.backend.dto.request.*;
import com.ems.backend.entity.*;
import com.ems.backend.enums.*;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class LeaveService {
    private final LeaveRequestRepository leaveRepo;
    private final EmployeeRepository empRepo;
    private final UserRepository userRepo;
    public LeaveRequest apply(LeaveApplyRequest r,String email){
        var u=userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        var e=empRepo.findByUser(u).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        return leaveRepo.save(LeaveRequest.builder().employee(e).type(LeaveType.valueOf(r.getType()))
            .fromDate(r.getFromDate()).toDate(r.getToDate()).reason(r.getReason()).status(LeaveStatus.PENDING).build());
    }
    public LeaveRequest action(Long id,LeaveActionRequest r){
        var l=leaveRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Leave not found"));
        l.setStatus(LeaveStatus.valueOf(r.getStatus()));l.setAdminComment(r.getAdminComment());
        return leaveRepo.save(l);
    }
    public List<LeaveRequest> getAll(){return leaveRepo.findAll();}
    public List<LeaveRequest> getPending(){return leaveRepo.findByStatus(LeaveStatus.PENDING);}
    public List<LeaveRequest> getMine(String email){
        var u=userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        var e=empRepo.findByUser(u).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        return leaveRepo.findByEmployee(e);
    }
}
