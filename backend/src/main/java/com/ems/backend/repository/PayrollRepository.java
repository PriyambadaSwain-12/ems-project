package com.ems.backend.repository;
import com.ems.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PayrollRepository extends JpaRepository<Payroll,Long> {
    List<Payroll> findByEmployee(Employee e);
    Optional<Payroll> findByEmployeeAndMonthAndYear(Employee e, int month, int year);
    List<Payroll> findByMonthAndYear(int month, int year);
}
