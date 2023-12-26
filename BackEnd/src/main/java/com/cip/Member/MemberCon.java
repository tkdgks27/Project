package com.cip.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class MemberCon {
	@Autowired
	private MemberDAO mDAO;
	@Autowired
	private JPA jpa;
	
	// 로그인
	@PostMapping(value="/login.do",
			produces="application/json; charset=utf-8")
	public JwtToken loginDo(ResMemberDTO resm, saveJWT sjwt ,HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		
		if(mDAO.matchesBcrypt(resm)) {
			mDAO.KeyGeneration();
			JwtToken mjwt = mDAO.makeMemberJWT(mDAO.getInfo(resm));
			
			if(mDAO.getRefreshByResm(resm)==null) {
				mDAO.RefreshKeyGeneration();
				refreshToken rjwt = mDAO.makeRefreshJWT(resm);
//				토큰 db 저장
				mDAO.saveToken(sjwt, resm, mjwt, rjwt);
				return mjwt;
			}
			mDAO.upToken(sjwt, resm, mjwt);
			return mjwt;
		}
		return null;
	}
	
	// 회원가입
	@PostMapping(value="/join.do",
			produces="application/json; charset=utf-8")
	public ResponseEntity<ResMemberDTO> joinDo(ResMemberDTO resm, saveJWT sjwt ,HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		resm.setPw(mDAO.encodeBcrypt(resm));
		ResMemberDTO savedMember = jpa.save(resm);
		
//		토큰발급
		mDAO.KeyGeneration();
		mDAO.RefreshKeyGeneration();
		JwtToken access = mDAO.makeMemberJWT(resm);
		refreshToken refresh = mDAO.makeRefreshJWT(resm);
		mDAO.saveToken(sjwt, resm, access, refresh);
		
		return ResponseEntity.ok(savedMember);
	}
	
	// 아이디체크
	@PostMapping(value="/check.id",
			produces="application/json; charset=utf-8")
	public boolean idCheck(@RequestParam("id") String id, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		boolean result = mDAO.checkID(id);
		return result;
	}
	// 이메일체크
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
	
	// 이메일 인증번호체크
	@PostMapping(value="/check.code",
			produces="application/json; charset=utf-8")
	public boolean codeCheck(@RequestParam("verificationCode") String verificationCode, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		
		return mDAO.checkCode(verificationCode);
	}
	
	// 회원탈퇴
	@PostMapping(value="/join.out",
				produces="application/json; charset=utf-8")
	public void joinOut(JwtToken mjwt, HttpServletResponse res){
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO parse = mDAO.parseJWT(mjwt);
		jpa.deleteByIdLike(parse.getId());
	}
	

	// 엑세스토큰 단순갱신 (테스트용)
	@PostMapping(value="/token.refresh",
				 produces="application/json; charset=utf-8")
	public JwtToken loginDo(JwtToken mjwt, HttpServletResponse res) {
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		if(token != null) {
			return mDAO.makeMemberJWT(token);
		}
		return null;
	}
	
	// 엑세스토큰 해석(테스트용)
	@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
	@PostMapping(value="/parse.JWT",
			produces="application/json; charset=utf-8")
	public ResMemberDTO jwtParse(@RequestBody JwtToken mjwt, HttpServletResponse res) {
//		res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//		res.addHeader("Access-Control-Allow-Credentials", "true");
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		if(token != null) {
			return token;
		}
		return null;
		
	}
	
	// 회원정보수정
	   @PostMapping(value="/member.update",
	             produces="application/json; charset=utf-8")
	   public JwtToken memberUpdate(ResMemberDTO resm, JwtToken mjwt, HttpServletResponse res) {
		   res.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
			res.addHeader("Access-Control-Allow-Credentials", "true");
	      if(!resm.getPw().equals(mDAO.getInfo(resm).getPw())) {
	         resm.setPw(resm.getPw());
	      }
	      if(!resm.getPw().equals(mDAO.getInfo(resm).getEmail())) {
	         resm.setEmail(resm.getEmail());
	      }
	      if(!resm.getPw().equals(mDAO.getInfo(resm).getAddress())) {
	         resm.setAddress(resm.getAddress());
	      }
	      resm.setNum(mDAO.getInfo(resm).getNum());
	      jpa.save(resm);
	   return mDAO.makeMemberJWT(resm);
	   }
	
//			} catch(Exception e) {
//				System.out.println("토큰 만료");
//				return null;
//			}
//			return null;
//		}
	
	
	
	
	

}
