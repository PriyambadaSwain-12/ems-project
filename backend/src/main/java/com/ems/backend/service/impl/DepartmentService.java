package com.ems.backend.service.impl;
import com.ems.backend.entity.Department;
import com.ems.backend.exception.*;
import com.ems.backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository repo;
    public Department create(String name,String desc){
        if(repo.existsByName(name))throw new BadRequestException("Department already exists");
        return repo.save(Department.builder().name(name).description(desc).build());
    }
    public Department update(Long id,String name,String desc){
        var d=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));
        d.setName(name);d.setDescription(desc);return repo.save(d);
    }
    public void delete(Long id){if(!repo.existsById(id))throw new ResourceNotFoundException("Not found");repo.deleteById(id);}
    public List<Department> getAll(){return repo.findAll();}
}
