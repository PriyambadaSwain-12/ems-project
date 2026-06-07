package com.ems.backend.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component @RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwt;
    private final UserDetailsServiceImpl uds;
    @Override
    protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException {
        String h=req.getHeader("Authorization");
        if(h!=null&&h.startsWith("Bearer ")){
            try{
                String token=h.substring(7);
                String email=jwt.getEmail(token);
                if(email!=null&&SecurityContextHolder.getContext().getAuthentication()==null){
                    var ud=uds.loadUserByUsername(email);
                    if(jwt.isValid(token,ud)){
                        var auth=new UsernamePasswordAuthenticationToken(ud,null,ud.getAuthorities());
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }catch(Exception ignored){}
        }
        chain.doFilter(req,res);
    }
}
