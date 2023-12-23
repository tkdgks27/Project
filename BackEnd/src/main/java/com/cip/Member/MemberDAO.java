package com.cip.Member;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Date;
import java.util.List;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cip.Admin.adminDTO;
import com.cip.Admin.AdminJPA;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
@Service
public class MemberDAO {
	@Autowired
	JPA jpa;
	@Autowired
	private JavaMailSender jms;
	
	
	private String subject = "요청하신 인증번호입니다";
	private String emailCode;
	private String encodeKey;
	
	public String getEmailCode() {
			return emailCode;
	}
	
	public void KeyGeneration() {
        try {
            String algorithm = "HMACSHA256";
            KeyGenerator keyGenerator = KeyGenerator.getInstance(algorithm);
            
            SecretKey secretKey = keyGenerator.generateKey();
            
            encodeKey = java.util.Base64.getEncoder().encodeToString(secretKey.getEncoded());

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
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
					.signWith(Keys.hmacShaKeyFor(encodeKey.getBytes("utf-8")))
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
	
	
//public JwtToken makeAccessJWT(ResMemberDTO resm) {
//		
//		
//		Date now = new Date();
//		long tokenExpiration= now.getTime() + Duration.ofSeconds(100).toMillis();
//		String refreshtoken = null; // 유효기간 긴 토큰
//		try {
//			token= Jwts.builder()
//					.signWith(Keys.hmacShaKeyFor(key.getBytes("utf-8")))
//					.expiration(new Date(tokenExpiration))
//					.claim("num", resm.getNum())
//					.claim("id", resm.getId())
//					.claim("pw", resm.getPw())
//					.claim("birth", resm.getBirth())
//					.claim("email", resm.getEmail())
//					.claim("address", resm.getAddress())
//					.claim("admin", resm.getAdmin())
//					.compact();
//			return new JwtToken(resm.getId(), token, refreshtoken);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}
	
	public ResMemberDTO parseJWT(JwtToken mjwt) {
		try {
			String token = mjwt.getToken();
			JwtParser jp = Jwts.parser()
					.verifyWith(Keys.hmacShaKeyFor(encodeKey.getBytes("utf-8")))
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
	public String encodeBcrypt(ResMemberDTO resm) {
		  return new BCryptPasswordEncoder().encode(resm.getPw());
		}
	public boolean matchesBcrypt(ResMemberDTO resm) {
		  List<ResMemberDTO> result = jpa.findByIdLike(resm.getId());
		  ResMemberDTO user = result.get(0);
		  BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		  return passwordEncoder.matches(resm.getPw(), user.getPw());
		}
	
}
