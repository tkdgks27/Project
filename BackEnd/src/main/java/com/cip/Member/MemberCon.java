package com.cip.Member;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cip.Community.CommunityJPA;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class MemberCon {
	@Autowired
	private MemberDAO mDAO;
	@Autowired
	private JPA jpa;
	// 아이디체크
	@PostMapping(value="/check.id",
			produces="application/json; charset=utf-8")
	public boolean idCheck(@RequestParam("id") String id, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		boolean result = mDAO.checkID(id);
		return result;
	}
	// 이메일체크
	@PostMapping(value="/check.email",
			produces="application/json; charset=utf-8")
	public boolean emailCheck(ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		boolean emailAuth = mDAO.checkEmail(resm);
		if(emailAuth) {
			mDAO.makeCode();
			mDAO.sendCode(resm);
			return emailAuth;
		}
		return emailAuth;
		}
	
	// 이메일 인증번호체크
	@PostMapping(value="/check.code",
			produces="application/json; charset=utf-8")
	public boolean codeCheck(@RequestParam("verificationCode") String verificationCode, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		return mDAO.checkCode(verificationCode);
	}
	
	// 회원가입
	@PostMapping(value="/join.do",
				 produces="application/json; charset=utf-8")
	public ResponseEntity<ResMemberDTO> joinDo(ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO savedMember = jpa.save(resm);
		return ResponseEntity.ok(savedMember);
	}
	// 회원탈퇴
	@PostMapping(value="/join.out",
				produces="application/json; charset=utf-8")
	public void joinOut(JwtToken mjwt, HttpServletResponse res){
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		jpa.deleteByIdLike(parse.getId());
	}
	// 로그인
	@PostMapping(value="/login.do",
				produces="application/json; charset=utf-8")
	public JwtToken loginDo(ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		if(mDAO.login(resm)) {
			JwtToken token = mDAO.makeMemberJWT(mDAO.getInfo(resm));
			return token;
		}
		return null;
	}
	// 토큰해석
	@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
	@PostMapping(value="/parse.JWT",
			produces="application/json; charset=utf-8")
	public ResMemberDTO jwtParse(@RequestBody JwtToken mjwt, HttpServletResponse res) {
//		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		if(token != null) {
			return token;
		}
		return null;
		
	}
	// 회원정보수정
	@PostMapping(value="/member.update",
				 produces="application/json; charset=utf-8")
	public ResMemberDTO memberUpdate(ResMemberDTO resm, JwtToken mjwt, HttpServletResponse res) {
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		String pwInfo = parse.getPw();
		String emailInfo = parse.getEmail();
		String addInfo = parse.getAddress();
		
		if(!pwInfo.equals(resm.getPw())) {
			parse.setPw(resm.getPw());
		}
		if(!emailInfo.equals(resm.getEmail())) {
			parse.setEmail(resm.getEmail());
		}
		if(!addInfo.equals(resm.getAddress())) {
			parse.setAddress(resm.getAddress());
		}
		return jpa.save(parse);
		
	}
	
	
	

}
