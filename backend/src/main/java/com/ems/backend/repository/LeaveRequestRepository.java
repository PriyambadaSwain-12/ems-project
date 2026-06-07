package com.ems.backend.repository;
import com.ems.backend.entity.*;
import com.ems.backend.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long> {
    List<LeaveRequest> findByEmployee(Employee e);
    List<LeaveRequest> findByStatus(LeaveStatus s);
}
