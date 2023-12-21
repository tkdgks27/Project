package com.cip.Member;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name="pro_jwttoken")
public class JwtToken {
	
	@Id
	@SequenceGenerator(sequenceName = "pro_seq", name = "nps", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator= "nps")
	@Column(name="tok_id")
	private String id;
	
}
