package com.ems.backend.repository;
import com.ems.backend.entity.*;
import com.ems.backend.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    List<Attendance> findByEmployee(Employee e);
    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByEmployeeAndDate(Employee e, LocalDate date);
    long countByEmployeeAndStatusAndDateBetween(Employee e, AttendanceStatus s, LocalDate from, LocalDate to);
}
