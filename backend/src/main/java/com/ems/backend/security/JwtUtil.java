package com.ems.backend.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.*;
@Component
public class JwtUtil {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration}") private long expiration;
    private Key key(){return Keys.hmacShaKeyFor(secret.getBytes());}
    public String generate(UserDetails ud,String role){
        Map<String,Object> c=new HashMap<>();c.put("role",role);
        return Jwts.builder().setClaims(c).setSubject(ud.getUsername())
            .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+expiration))
            .signWith(key(),SignatureAlgorithm.HS256).compact();
    }
    public String getEmail(String t){return parse(t).getSubject();}
    public String getRole(String t){return(String)parse(t).get("role");}
    private Claims parse(String t){return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(t).getBody();}
    public boolean isValid(String token,UserDetails ud){
        try{return getEmail(token).equals(ud.getUsername())&&!parse(token).getExpiration().before(new Date());}
        catch(Exception e){return false;}
    }
}
