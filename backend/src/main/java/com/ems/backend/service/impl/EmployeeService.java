package com.ems.backend.service.impl;
import com.ems.backend.dto.request.EmployeeRequest;
import com.ems.backend.dto.response.EmployeeResponse;
import com.ems.backend.entity.*;
import com.ems.backend.enums.Role;
import com.ems.backend.exception.*;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository empRepo;
    private final UserRepository userRepo;
    private final DepartmentRepository deptRepo;
    private final PasswordEncoder enc;
    public EmployeeResponse toResp(Employee e){
        if(e==null)return null;
        String name=e.getUser()!=null?e.getUser().getName():"Unknown";
        String email=e.getUser()!=null?e.getUser().getEmail():"";
        return EmployeeResponse.builder().id(e.getId()).empCode(e.getEmpCode())
            .name(name).email(email)
            .departmentId(e.getDepartment()!=null?e.getDepartment().getId():null)
            .departmentName(e.getDepartment()!=null?e.getDepartment().getName():null)
            .designation(e.getDesignation()).joiningDate(e.getJoiningDate())
            .phone(e.getPhone()).address(e.getAddress()).gender(e.getGender())
            .dateOfBirth(e.getDateOfBirth()).basicSalary(e.getBasicSalary())
            .profilePhoto(e.getProfilePhoto()).build();
    }
    private String nextCode(){return String.format("EMP%04d",empRepo.count()+1);}
    public EmployeeResponse create(EmployeeRequest r){
        if(userRepo.existsByEmail(r.getEmail()))throw new BadRequestException("Email already exists");
        String pwd=(r.getPassword()!=null&&!r.getPassword().isBlank())?r.getPassword():"Employee@123";
        var u=userRepo.save(User.builder().name(r.getName()).email(r.getEmail())
            .password(enc.encode(pwd)).role(Role.EMPLOYEE).active(true).build());
        var d=r.getDepartmentId()!=null?deptRepo.findById(r.getDepartmentId()).orElse(null):null;
        var e=empRepo.save(Employee.builder().user(u).empCode(nextCode()).department(d)
            .designation(r.getDesignation())
            .joiningDate(r.getJoiningDate()!=null?r.getJoiningDate():LocalDate.now())
            .phone(r.getPhone()).address(r.getAddress()).gender(r.getGender())
            .dateOfBirth(r.getDateOfBirth())
            .basicSalary(r.getBasicSalary()!=null?r.getBasicSalary():0.0)
            .profilePhoto(r.getProfilePhoto()).build());
        return toResp(e);
    }
    public EmployeeResponse update(Long id,EmployeeRequest r){
        var e=empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        if(r.getName()!=null&&e.getUser()!=null)e.getUser().setName(r.getName());
        if(r.getPhone()!=null)e.setPhone(r.getPhone());
        if(r.getAddress()!=null)e.setAddress(r.getAddress());
        if(r.getDesignation()!=null)e.setDesignation(r.getDesignation());
        if(r.getBasicSalary()!=null)e.setBasicSalary(r.getBasicSalary());
        if(r.getGender()!=null)e.setGender(r.getGender());
        if(r.getDateOfBirth()!=null)e.setDateOfBirth(r.getDateOfBirth());
        if(r.getProfilePhoto()!=null)e.setProfilePhoto(r.getProfilePhoto().isEmpty()?null:r.getProfilePhoto());
        if(r.getDepartmentId()!=null)
            e.setDepartment(deptRepo.findById(r.getDepartmentId()).orElseThrow(()->new ResourceNotFoundException("Dept not found")));
        if(e.getUser()!=null)userRepo.save(e.getUser());
        return toResp(empRepo.save(e));
    }
    public void delete(Long id){var e=empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));empRepo.delete(e);}
    public EmployeeResponse getById(Long id){return toResp(empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found")));}
    public EmployeeResponse getMyProfile(String email){
        var u=userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        var e=empRepo.findByUser(u).orElseThrow(()->new ResourceNotFoundException("Profile not found"));
        return toResp(e);
    }
    public List<EmployeeResponse> getAll(){return empRepo.findAllByUserIsNotNull().stream().map(this::toResp).collect(Collectors.toList());}
}
