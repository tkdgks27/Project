package com.cip.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cip.Member.JwtToken;
import com.cip.Member.MemberDAO;
import com.cip.Member.ResMemberDTO;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AdminCon {
	@Autowired
	MemberDAO mDAO;
	@Autowired
	DataRoom dr;
	
	// 유저 강퇴
	@PostMapping(value="/banished.do",
				produces = "application/json; charset=utf-8")
	public void banished(JwtToken mjwt, ResMemberDTO resm, HttpServletResponse res) {
		
		
		
	}
	// 회원등급조절
	@PostMapping(value="/grade.change",
				 produces = "application/json; charset=utf-8")
	public void changeGrade(JwtToken mjwt, ResMemberDTO resm, HttpServletResponse res) {
		
	}
	
	@PostMapping(value="/data.upload",
				 produces = "application/json; charset=utf-8")
	public ResponseEntity<String> upload(JwtToken mjwt, MultipartFile mf ,int chunkNumber, int totalChunks ,HttpServletResponse res) {
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		if(!parse.getAdmin().isEmpty()) {
			boolean uploadDone = dr.uploadFile(mf, chunkNumber, totalChunks);
			
			return uploadDone? ResponseEntity.ok("success") : ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).build();
		}
		return null;
	}
	
}
