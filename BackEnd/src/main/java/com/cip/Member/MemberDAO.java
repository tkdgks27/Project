package com.cip.Member;

import java.awt.RenderingHints.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cip.Mail.EmailPostDto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
@Service
public class MemberDAO {
	@Autowired
	CreateKey createKey;
	
	public void join(Member m, HttpServletRequest req) {
		
	}
	
	public JwtToken makeMemberJWT(Member m) {
		Date now = new Date();
		long tokenExpiration= now.getTime() + Duration.ofSeconds(20).toMillis();
		
		String token;
		try {
			token= Jwts.builder()
					.signWith(Keys.hmacShaKeyFor(createKey.generateKey(33).getBytes("utf-8")))
					.expiration(new Date(tokenExpiration))
					.claim("id", m.getId())
					.claim("pw", m.getPw())
					.claim("birth", m.getBirth())
					.claim("email", m.getEmail())
					.claim("address", m.getAddress())
					.compact();
			return new JwtToken(token);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	public void join(Member m) {
		
	}
	
}
