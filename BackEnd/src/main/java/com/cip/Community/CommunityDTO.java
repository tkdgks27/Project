package com.cip.Community;

import java.util.Date;

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
@Entity(name= "pro_community")
public class CommunityDTO {
	@Id
	@SequenceGenerator(sequenceName="pro_one_community_seq", name="pocs", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "pocs")
	@Column(name="pro_num")
	private Integer num;
	
	@Column(name="pro_id")
	private String id;
	
	@Column(name="pro_title")
	private String title;
	
	@Column(name="pro_subject")
	private String subject;
	
	@Column(name="pro_file")
	private String file;
	
	@Column(name="pro_date")
	private Date date;
}
