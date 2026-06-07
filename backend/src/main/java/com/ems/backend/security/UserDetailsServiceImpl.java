package com.ems.backend.security;
import com.ems.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository repo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u=repo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Not found: "+email));
        return new User(u.getEmail(),u.getPassword(),List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name())));
    }
}
