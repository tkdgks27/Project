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
	@Column(name="com_num")
	private Integer num;
	
	@Column(name="com_id")
	private String id;
	
	@Column(name="com_title")
	private String title;
	
	@Column(name="com_subject")
	private String subject;
	
	@Column(name="com_file")
	private String file;
	
	@Column(name="com_date")
	private Date date;
	
	@Column(name="com_comment")
	private String comment;
}
