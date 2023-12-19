package com.cip.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class MemberCon {
	@Autowired
	private MemberDAO mDAO;
	@Autowired
	private JPA jpa;
	
	@PostMapping(value="/check.id",
			produces="application/json; charset=utf-8")
	public boolean idCheck(@RequestParam("id") String id, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		boolean result = mDAO.checkID(id);
		return result;
	}
	
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
	
	
	@PostMapping(value="/check.code",
			produces="application/json; charset=utf-8")
	public boolean codeCheck(@RequestParam("verificationCode") String verificationCode, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		return mDAO.checkCode(verificationCode);
	}
	
	
	@PostMapping(value="/join.do",
				 produces="application/json; charset=utf-8")
	public ResponseEntity<ResMemberDTO> joinDo(ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		System.out.println(resm.getNum());
		System.out.println(mDAO.getKey());
		ResMemberDTO savedMember = jpa.save(resm);
		return ResponseEntity.ok(savedMember);
	}
	
	@PostMapping(value="/login.do",
				produces="application/json; charset=utf-8")
	public JwtToken loginDo(ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		if(mDAO.login(resm)) {
			JwtToken token = mDAO.makeMemberJWT(mDAO.getInfo(resm));
//			ResMemberDTO parse = mDAO.parseJWT(token);
			System.out.println(mDAO.getInfo(resm));
			return token;
		}
		return null;
	}
	
//	@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
	@PostMapping(value="/parse.JWT",
			produces="application/json; charset=utf-8")
	public ResMemberDTO jwtParse(@RequestBody JwtToken mjwt, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		System.out.println(mjwt);
		System.out.println(token);
		return token;
	}
	
	

}
