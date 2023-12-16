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
		System.out.println(mDAO.checkCode(verificationCode));
		System.out.println(mDAO.getEmailCode());
		System.out.println(verificationCode);
		return mDAO.checkCode(verificationCode);
	}
	
	
	@PostMapping(value="/join.do",
				 produces="application/json; charset=utf-8")
	public @ResponseBody ResponseEntity<ResMemberDTO> joinDo(ResMemberDTO resm, @RequestParam("address") String s1,
															 @RequestParam("addressDetail") String s2, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		mDAO.makeMemberJWT(resm, s1, s2);
		ResMemberDTO savedMember = jpa.save(resm);
		return ResponseEntity.ok(savedMember);
	}
	
	@PostMapping(value="/parse.JWT",
			produces="application/json; charset=utf-8")
	public ResponseEntity<ResMemberDTO> jwtParse(@RequestBody JwtToken mjwt, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		return ResponseEntity.ok(parse);
	}
	
	

}
