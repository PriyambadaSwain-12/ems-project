package com.ems.backend.config;
import com.ems.backend.entity.User;
import com.ems.backend.enums.Role;
import com.ems.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component @RequiredArgsConstructor @Slf4j
public class DataInitializer implements CommandLineRunner {
    private final UserRepository repo;
    private final PasswordEncoder enc;
    @Override public void run(String... args){
        if(!repo.existsByEmail("admin@ems.com")){
            repo.save(User.builder().name("System Admin").email("admin@ems.com")
                .password(enc.encode("Admin@123")).role(Role.ADMIN).active(true).build());
            log.info("✅ Admin created → admin@ems.com / Admin@123");
        }
    }
}
