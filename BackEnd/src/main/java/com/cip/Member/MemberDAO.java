package com.cip.Member;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Date;
import java.util.List;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Service
public class MemberDAO {
	@Autowired
	JPA jpa;
	@Autowired
	private JavaMailSender jms;
	@Autowired
	TokenJPA tjpa;
	
	
	private String subject = "요청하신 인증번호입니다";
	private String emailCode;
	private String encodeKey;
	private String refreshEncodeKey;
	
	public String getEmailCode() {
			return emailCode;
	}
	
	
	
	
//	아이디 중복성검사
	public boolean checkID(String id) {
	    List<ResMemberDTO> result = jpa.findByIdLike(id);
	    return result.isEmpty();
	}
	
//	이메일 중복성 검사
	public boolean checkEmail(ResMemberDTO resm) {
		List<ResMemberDTO> result = jpa.findByEmailLike(resm.getEmail());
		if(result.isEmpty()) {
			return true;
		}
		return false;
	}
	
//	이메일코드 검증
	public boolean checkCode(String verificationCode) {
//		return getEmailCode().equals(vDTO);
		boolean result = getEmailCode().equals(verificationCode);
		return result;
	}
	
//	이메일 검증할 코드 생성
	public void makeCode() {
		StringBuilder sb = new StringBuilder();
		SecureRandom ran = new SecureRandom();
		for (int i = 0; i < 7; i++) {
			long randomKey = ran.nextInt(10);
			sb.append(randomKey);
		}
		emailCode = sb.toString();
	}
	
//	메일로 생성된 랜덤코드 보내기
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
	
//	멤버테이블 특정 id에 저장된 값 가져오기
	public ResMemberDTO getInfo(ResMemberDTO resm) {
		List<ResMemberDTO> result = jpa.findByIdLike(resm.getId());
	        return result.get(0);
	}
	
//	엑세스토큰으로 리프레쉬토큰 가져오기
	public String getRefreshByToken(JwtToken mjwt) {
		ResMemberDTO parse = parseJWT(mjwt);
		List<saveJWT> entity = tjpa.findByIdLike(parse.getId());
		String getrefresh = entity.get(0).getRefreshtoken();
		return getrefresh;
	}
	
//	멤버정보로 리프레쉬토큰 가져오기
	public String getRefreshByResm(ResMemberDTO resm) {
		List<saveJWT> entity = tjpa.findByIdLike(resm.getId());
		String getrefresh = entity.get(0).getRefreshtoken();
		return getrefresh;
	}
	
	
//	엑세스토큰 키값생성
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
//	리프레쉬토큰 키값생성
	public void RefreshKeyGeneration() {
		try {
			String algorithm = "HMACSHA256";
			KeyGenerator keyGenerator = KeyGenerator.getInstance(algorithm);
			
			SecretKey secretKey = keyGenerator.generateKey();
			
			refreshEncodeKey = java.util.Base64.getEncoder().encodeToString(secretKey.getEncoded());
			
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	
//	엑세스토큰 생성
	public JwtToken makeMemberJWT(ResMemberDTO resm) {
		
		
		Date now = new Date();
		long tokenExpiration= now.getTime() + Duration.ofMinutes(30).toMillis();
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
	
//	리프레쉬토큰
public refreshToken makeRefreshJWT(ResMemberDTO resm) {
		Date now = new Date();
		long tokenExpiration= now.getTime() + Duration.ofDays(3).toMillis();
		String refreshtoken = null; // 유효기간 긴 토큰
		try {
			refreshtoken= Jwts.builder()
					.signWith(Keys.hmacShaKeyFor(refreshEncodeKey.getBytes("utf-8")))
					.expiration(new Date(tokenExpiration))
					.claim("num", resm.getNum())
					.claim("id", resm.getId())
					.claim("pw", resm.getPw())
					.claim("birth", resm.getBirth())
					.claim("email", resm.getEmail())
					.claim("address", resm.getAddress())
					.claim("admin", resm.getAdmin())
					.compact();
			return new refreshToken(refreshtoken);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

// 토큰저장
public saveJWT saveToken(saveJWT sjwt, ResMemberDTO resm, JwtToken mjwt, refreshToken rjwt) {
	sjwt.setId(resm.getId());
	sjwt.setAccesss(mjwt.getToken());
	sjwt.setRefreshtoken(rjwt.getRefreshtoken());
	
	return tjpa.save(sjwt);
}
// 리프레쉬 있을때
public void upToken(saveJWT sjwt, ResMemberDTO resm, JwtToken mjwt) {
	String getid = resm.getId();
	String newAccess = mjwt.getToken();
	tjpa.updateById(newAccess, getid);
}


//	토큰 파싱
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
	
//	비밀번호 암호화
	public String encodeBcrypt(ResMemberDTO resm) {
		  return new BCryptPasswordEncoder().encode(resm.getPw());
		}
//	암호화 비밀번호 검증
	public boolean matchesBcrypt(ResMemberDTO resm) {
		  List<ResMemberDTO> result = jpa.findByIdLike(resm.getId());
		  ResMemberDTO user = result.get(0);
		  BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		  return passwordEncoder.matches(resm.getPw(), user.getPw());
		}
	
}
