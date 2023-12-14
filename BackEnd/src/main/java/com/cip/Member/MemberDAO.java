package com.cip.Member;

import java.awt.RenderingHints.Key;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
@Service
public class MemberDAO {
	@Autowired
	CreateKey createKey;
	@Autowired
	JPA jpa;
	private SimpleDateFormat sdf;
	private String key = CreateKey.generateKey();
	private JavaMailSender jms;
	private String subject = "요청하신 인증번호입니다";
	
	
	public MemberDAO() {
		sdf = new SimpleDateFormat("yyyyMMdd");
	}
	
	public static String makeCode() {
		StringBuilder sb = new StringBuilder();
        SecureRandom ran = new SecureRandom();
        String code = null;
        for (int i = 0; i < 7; i++) {
            long randomKey = ran.nextInt(10);
            sb.append(randomKey);
            code = sb.toString();
        }
        return code;
	}
	
	public ResponseEntity<String> sendCode(ReqMemberDTO reqm) {
		MimeMessage mm = jms.createMimeMessage();
		try {
			MimeMessageHelper mmh = new MimeMessageHelper(mm, true);
			mmh.setTo(reqm.getId());
			mmh.setSubject(subject);
			mmh.setText(makeCode());
			jms.send(mm);
			return ResponseEntity.ok("Code sent successfully");
		} catch (MessagingException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send code");
		}
	}
	
	public boolean checkID(String userId) {
		List<ResMemberDTO> result = jpa.findByIdLike(userId);
		  return result != null && !result.isEmpty();
	}
	public boolean checkEmail(ReqMemberDTO reqm) {
		List<ResMemberDTO> result = jpa.findByIdLike(reqm.getEmail());
		if(result != null) {
			return true;
		}
		return false;
	}
	
	public JwtToken makeMemberJWT(ResMemberDTO resm) {
		Date now = new Date();
		long tokenExpiration= now.getTime() + Duration.ofSeconds(20).toMillis();
		String token = null;
		try {
			token= Jwts.builder()
					.signWith(Keys.hmacShaKeyFor(key.getBytes("utf-8")))
					.expiration(new Date(tokenExpiration))
					.claim("id", resm.getId())
					.claim("pw", resm.getPw())
					.claim("birth", resm.getBirth())
					.claim("email", resm.getEmail())
					.claim("address", resm.getAddress())
					.compact();
			return new JwtToken(token);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public ResMemberDTO parseJWT(JwtToken mtoken) {
		try {
			String token = mtoken.getToken();
			JwtParser jp = Jwts.parser()
					.verifyWith(Keys.hmacShaKeyFor(key.getBytes("utf-8")))
					.build();
			Claims c = jp.parseSignedClaims(token).getPayload();
			String id = (String) c.get("id");
			String pw = (String) c.get("pw");
			Date birth = sdf.parse((String) c.get("birth"));
			String email = (String) c.get("email");
			String address = (String) c.get("realAddress");
			return new ResMemberDTO(id, pw, birth, email, address);
			} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
//	 public boolean validateToken(String token) {
//	        
//	    }
	
//	public void join(Member m) {
//		
//	}
	
}
