package com.ems.backend.repository;
import com.ems.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByUser(User user);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findAllByUserIsNotNull();
}
