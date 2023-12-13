package com.cip.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cip.Email.EmailDAO;
import com.cip.Email.EmailDTO;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class MemberCon {
	@Autowired
	private MemberDAO mDAO;
	@Autowired
	private JPA jpa;
	
	@PostMapping(value="/check.id",
			produces="application/json; charset=utf-8")
	public @ResponseBody boolean idCheck(@RequestParam("userId") String userId, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3003/user");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		return mDAO.checkID(userId);
	}
	
	@PostMapping(value="/check.email", produces="application/json; charset=utf-8")
	public void codeSend(@RequestBody ReqMemberDTO reqm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		mDAO.checkEmail(reqm);
		mDAO.sendCode(reqm);
		}
	
	
	@PostMapping(value="/check.code",
			produces="application/json; charset=utf-8")
	public void codeCheck(@RequestBody ReqMemberDTO reqm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
//		if(reqm.getEmailCode() != )
	}
	
	
	@PostMapping(value="/join.do",
				 produces="application/json; charset=utf-8")
	public ResponseEntity<ResMemberDTO> joinDo(@RequestBody ReqMemberDTO reqm, ResMemberDTO resm, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		String combinedAddress = reqm.getAddress() + "!" + reqm.getAddressDetail();
		resm.setId(reqm.getId());
		resm.setPw(reqm.getPw());
		resm.setBirth(reqm.getBirth());
		resm.setEmail(reqm.getEmail());
        resm.setAddress(combinedAddress);
		mDAO.makeMemberJWT(resm);
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
