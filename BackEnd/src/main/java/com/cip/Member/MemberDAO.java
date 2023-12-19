package com.cip.Member;

import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.hibernate.boot.model.internal.MapKeyColumnDelegator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
@Service
public class MemberDAO {
	@Autowired
	JPA jpa;
	@Autowired
	private JavaMailSender jms;
	
	private static final String key = "123451234512345123451234512345123";
	private String subject = "요청하신 인증번호입니다";
	private String emailCode;
	
	
	public String getEmailCode() {
			return emailCode;
	}
	public String getKey() {
		return key;
	}
	
//	1
	public boolean checkID(String id) {
	    List<ResMemberDTO> result = jpa.findByIdLike(id);
	    return result.isEmpty();
	}
	
	public boolean checkEmail(ResMemberDTO resm) {
		List<ResMemberDTO> result = jpa.findByEmailLike(resm.getEmail());
		if(result.isEmpty()) {
			return true;
		}
		return false;
	}
	
	public boolean checkCode(String verificationCode) {
//		return getEmailCode().equals(vDTO);
		boolean result = getEmailCode().equals(verificationCode);
		return result;
	}
	
	public void makeCode() {
		StringBuilder sb = new StringBuilder();
		SecureRandom ran = new SecureRandom();
		for (int i = 0; i < 7; i++) {
			long randomKey = ran.nextInt(10);
			sb.append(randomKey);
		}
		emailCode = sb.toString();
	}
	
	public synchronized void sendCode(ResMemberDTO resm) {
		MimeMessage mm = jms.createMimeMessage();
		try {
			MimeMessageHelper mmh = new MimeMessageHelper(mm, true);
			mmh.setTo(resm.getEmail());
			mmh.setSubject(subject);
			mmh.setText(emailCode);
			jms.send(mm);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}
	
	
	public ResMemberDTO getInfo(ResMemberDTO resm) {
		List<ResMemberDTO> result = jpa.findByIdLike(resm.getId());
	        return result.get(0);
	}
	
	public JwtToken makeMemberJWT(ResMemberDTO resm) {
		
		
		Date now = new Date();
		long tokenExpiration= now.getTime() + Duration.ofSeconds(100).toMillis();
		String token = null;
		try {
			token= Jwts.builder()
					.signWith(Keys.hmacShaKeyFor(key.getBytes("utf-8")))
					.expiration(new Date(tokenExpiration))
					.claim("num", resm.getNum())
					.claim("id", resm.getId())
					.claim("pw", resm.getPw())
					.claim("birth", resm.getBirth())
					.claim("email", resm.getEmail())
					.claim("address", resm.getAddress())
					.claim("admin", resm.getAdmin())
					.compact();
			return new JwtToken(token);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public ResMemberDTO parseJWT(JwtToken mjwt) {
		try {
			String token = mjwt.getToken();
			JwtParser jp = Jwts.parser()
					.verifyWith(Keys.hmacShaKeyFor(key.getBytes("utf-8")))
					.build();
			Claims c = jp.parseSignedClaims(token).getPayload();
			Integer num = (Integer) c.get("num");
			String id = (String) c.get("id");
			String pw = (String) c.get("pw");
			Date birth = new Date((long) c.get("birth"));
			String email = (String) c.get("email");
			String address = (String) c.get("address");
			String admin = (String) c.get("admin");
			return new ResMemberDTO(num ,id, pw, birth, email, address, admin);
			} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
//	3
//	 public boolean validateToken(String token) {
//	        
//	    }
	
	public boolean login(ResMemberDTO resm) {
		List<ResMemberDTO> result = jpa.findByIdLike(resm.getId());
		if (result != null && !result.isEmpty()) {
			ResMemberDTO user = result.get(0);
			if(resm.getPw().equals(user.getPw())) {
				
				return true;
			}
		}
		return false;
		
	}
	
}
