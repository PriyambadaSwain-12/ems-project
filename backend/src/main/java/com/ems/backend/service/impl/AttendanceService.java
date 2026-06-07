package com.ems.backend.service.impl;
import com.ems.backend.dto.request.AttendanceRequest;
import com.ems.backend.entity.*;
import com.ems.backend.enums.AttendanceStatus;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
@Service @RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attRepo;
    private final EmployeeRepository empRepo;
    private final UserRepository userRepo;
    public Attendance mark(AttendanceRequest r){
        var e=empRepo.findById(r.getEmployeeId()).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        var a=attRepo.findByEmployeeAndDate(e,r.getDate()).orElse(Attendance.builder().employee(e).date(r.getDate()).build());
        a.setStatus(AttendanceStatus.valueOf(r.getStatus()));
        a.setRemarks(r.getRemarks());
        return attRepo.save(a);
    }
    public List<Attendance> getByEmployee(Long id){
        var e=empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));
        return attRepo.findByEmployee(e);
    }
    public List<Attendance> getByDate(LocalDate date){return attRepo.findByDate(date);}
    public List<Attendance> getMine(String email){
        var u=userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        var e=empRepo.findByUser(u).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        return attRepo.findByEmployee(e);
    }
    public Map<String,Long> getSummary(Long id,int month,int year){
        var e=empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));
        LocalDate from=LocalDate.of(year,month,1),to=from.withDayOfMonth(from.lengthOfMonth());
        var m=new HashMap<String,Long>();
        for(var s:AttendanceStatus.values()) m.put(s.name(),attRepo.countByEmployeeAndStatusAndDateBetween(e,s,from,to));
        return m;
    }
}
