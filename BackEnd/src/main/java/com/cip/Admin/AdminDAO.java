package com.cip.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cip.Member.JPA;
import com.cip.Member.JwtToken;
import com.cip.Member.MemberDAO;
import com.cip.Member.ResMemberDTO;

@Service
public class AdminDAO {
	@Autowired
	MemberDAO mDAO;
	@Autowired
	JPA jpa;
	@Autowired
	AdminJPA ajpa;
	
	public void ban(JwtToken mjwt, ResMemberDTO resm) {
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		if(token.getAdmin() != null) {
			
			jpa.deleteByEmailLike(resm.getEmail());
			ajpa.save(resm.getEmail());
		}
		
	}
	
	
}
