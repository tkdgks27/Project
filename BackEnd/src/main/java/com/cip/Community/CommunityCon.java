package com.cip.Community;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cip.Member.JwtToken;
import com.cip.Member.MemberDAO;
import com.cip.Member.ResMemberDTO;

import jakarta.servlet.http.HttpServletResponse;
@RestController
public class CommunityCon {
	@Autowired
	CommunityJPA cJPA;
	@Autowired
	CommunityDAO cDAO;
	@Autowired
	MemberDAO mDAO;
	
	// 글쓰기
	@PostMapping(value="/write.do",
			produces="application/json; charset=utf-8")
	public CommunityDTO post(@RequestBody JwtToken mjwt, CommunityDTO cDTO, MultipartFile mf, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		
		return cDAO.post(mjwt, cDTO, mf);
	}
	
	// 글 삭제
	@PostMapping(value="/post.delete", 
				 produces="application/json; charset=utf-8")
	public List<CommunityDTO> postDelete(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
//		글쓴사람의 아이디와 현재사용자의 아이디가 같으면 삭제
		if(token.getId().equals(cDTO.getId())) {
			return cJPA.deleteByNum(cDTO.getNum());
		}
		return null;
	}
	
	// 글수정하러가기
	@PostMapping(value="/rewrite.go",
			produces="application/json; charset=utf-8")
	public boolean rewriteGo(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
//		글쓴사람의 아이디와 현재사용자의 아이디가 같으면 수정창으로		
		if(token.getId().equals(cDTO.getId())) {
			
			return true;
		}
		return false;
	}
	// 글수정
	@PostMapping(value="/post.rewrite",
				produces="application/json; charset=utf-8")
	public List<CommunityDTO> rewrite(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res){
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
//		토큰이 유효하면 글 저장
		if(token != null) {
			return cJPA.save(cJPA.findByNum(cDTO.getNum()));
		}
		
		return null;
	}
	
//	게시판 메인페이지
	@GetMapping(value="post.get",
			  	produces="application/json; charset=utf-8")
	public void getPost(JwtToken mjwt, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		
		cDAO.getPost();
	}
		
	
}
