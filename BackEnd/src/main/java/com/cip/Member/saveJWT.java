package com.cip.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name="jwttoken")
public class saveJWT {
		@Id
		@Column(name="id")
		private String id;
		
		@Column(name= "accesss")
		private String accesss;
		
		@Column(name="refresh")
		private String refresh;
}
