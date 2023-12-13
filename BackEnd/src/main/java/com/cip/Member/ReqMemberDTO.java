package com.cip.Member;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReqMemberDTO {
private String id;
	
	private String userId;
	
	private String pw;
	
	private Date birth;
	
	private String email;
	
	private String emailCode;
	
	private String address;
	
	private String addressDetail;
}
