package com.cip.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	AdminDAO aDAO;
	@Autowired
	DataRoom dr;
	@Autowired
	DataRoomJPA djpa;
	
	// 유저 강퇴
	@PostMapping(value="/banished.do",
				produces = "application/json; charset=utf-8")
	public boolean banished(JwtToken mjwt, ResMemberDTO resm, HttpServletResponse res) {
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		if(parse.getAdmin().equals("1")) {
			aDAO.ban(mjwt, resm);
			return true;
		}
		if(parse.getAdmin().equals("2")) {
			if(resm.getAdmin().equals("1")) {
				return false;
			}
			aDAO.ban(mjwt, resm);
			return true;
		}
		return false;
	}
	// 회원등급조절
	@PostMapping(value="/grade.change",
				 produces = "application/json; charset=utf-8")
	public void changeGrade(JwtToken mjwt, ResMemberDTO resm, HttpServletResponse res) {
		
	}
	
	// 데이터업로드
	@PostMapping(value="/data.upload",
				 produces = "application/json; charset=utf-8")
	public ResponseEntity<DataRoomDTO> upload(JwtToken mjwt, DataRoomDTO dDTO , MultipartFile mf ,int chunkNumber, int totalChunks ,HttpServletResponse res) {
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		dDTO.setId(parse.getId());
		dDTO.setFile(dr.getPath() + mf.getOriginalFilename());
		if(!parse.getAdmin().isEmpty()) {
			boolean uploadDone = dr.uploadFile(mf, chunkNumber, totalChunks);
			
			return uploadDone? ResponseEntity.ok(djpa.save(dDTO)) : ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).build();
		}
		return null;
	}
	@GetMapping("/data/{file}")
	public ResponseEntity<Resource> getData(@PathVariable("file") String f){
		return dr.getFile(f);
	}
	
}
