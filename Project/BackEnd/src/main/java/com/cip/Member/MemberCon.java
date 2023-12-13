package com.cip.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class MemberCon {
	@Autowired
	private MemberDAO mDAO;
	
	@PostMapping(value="/join.do",
				 produces="application/json; charset=utf-8")
	public Member jwtMake(Member m, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "react_host_name");
		return mDAO.makeMemberJWT(m);
	}
}
