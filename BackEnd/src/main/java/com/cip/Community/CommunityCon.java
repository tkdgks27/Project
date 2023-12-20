package com.cip.Community;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public CommunityDTO post(@RequestParam JwtToken mjwt, CommunityDTO cDTO, MultipartFile mf, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		cDAO.post(mjwt, cDTO, mf);
		return cJPA.save(cDTO);
	}
	
	// 삭제하기
	@PostMapping(value="/post.delete", 
				 produces="application/json; charset=utf-8")
	public List<CommunityDTO> postDelete(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		
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
		if(token.getId().equals(cDTO.getId())) {
			return cJPA.save(cJPA.findById(cDTO.getId()));
		}
		
		return null;
	}
	
	// 전체페이지 표시
	@GetMapping(value="/page.count",
				produces="application/json; charset=utf-8")
	public List<CommunityDTO> pageCount(JwtToken mjwt, HttpServletResponse res){
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");

		return cJPA.findByDateAcs();
	}
	
	@GetMapping(value="post.get",
			  	produces="application/json; charset=utf-8")
	public void getPost(JwtToken mjwt, HttpServletResponse res) {
		
	}
		
	
}
