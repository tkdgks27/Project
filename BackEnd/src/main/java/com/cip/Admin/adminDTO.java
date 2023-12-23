package com.cip.Admin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity(name="pro_banishedemail")
public class adminDTO {
	
	@Id
	@SequenceGenerator(sequenceName = "pro_one_banishedemail_seq", name = "pobs", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator= "pobs")
	@Column(name="pro_email", insertable = false, updatable = false)
	private String email;
}
