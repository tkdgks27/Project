package com.cip.Member;


import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name="pro_member")
public class ResMemberDTO {

	@Id
	@SequenceGenerator(sequenceName = "pro_seq", name = "nps", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator= "nps")
	@Column(name= "pro_id")
	private String id;
	
	@Column(name= "pro_pw")
	private String pw;
	
	@Column(name= "pro_birth")
	private Date birth;
	
	@Column(name= "pro_email")
	private String email;
	
	@Column(name= "pro_address")
	private String Address;
	
	@Column(name="pro_admin")
	private String admin;
	
	
	

	
}
