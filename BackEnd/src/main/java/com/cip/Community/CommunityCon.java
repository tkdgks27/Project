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

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class CommunityCon {
	@Autowired
	CommunityJPA cJPA;
	@Autowired
	CommunityDAO cDAO;
	@Autowired
	MemberDAO mDAO;
	
	
	@PostMapping(value="/write.do",
			produces="application/json; charset=utf-8")
	public CommunityDTO post(@RequestParam JwtToken mjwt, CommunityDTO cDTO, MultipartFile mf, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		cDAO.post(mjwt, cDTO, mf);
		return cJPA.save(cDTO);
	}
	
	@PostMapping(value="/post.delete", 
				 produces="application/json; charset=utf-8")
	public List<CommunityDTO> postDelete(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		
		if(mDAO.parseJWT(mjwt).getId() != null) {
			
			return cJPA.deleteByNum(cDTO.getNum());
		}
		return null;
		
	}
	
	@PostMapping(value="/post.rewrite", 
				produces="application/json; charset=utf-8")
	public List<CommunityDTO> rewrite(JwtToken mjwt, CommunityDTO cDTO, HttpServletResponse res){
		
		return cJPA.findByNum(cDTO.getNum());
	}
	
	@GetMapping(value="/page.count",
				produces="application/json; charset=utf-8")
	public List<CommunityDTO> pageCount(JwtToken mjwt, HttpServletResponse res){
		return cJPA.findByNum(null);
	}
	
		
	
}
