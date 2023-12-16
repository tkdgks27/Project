package com.cip.Community;

import java.util.Date;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name= "pro_community")
public class CommunityDTO {
	private String id;
	private String title;
	private String subject;
	private String file;
	private Date date;
}
