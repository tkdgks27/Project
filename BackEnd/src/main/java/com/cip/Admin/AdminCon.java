package com.cip.Admin;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cip.Member.JwtToken;
import com.cip.Member.ResMemberDTO;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AdminCon {
	
	@PostMapping(value="/banished.do",
				produces = "application/json; charset=utf-8")
	public void banished(JwtToken mjwt, ResMemberDTO resm, HttpServletResponse res) {
		
	}
	
	@PostMapping(value="grade.change",
				 produces = "application/json; charset=utf-8")
	public void banished(JwtToken mjwt, )
	
}
