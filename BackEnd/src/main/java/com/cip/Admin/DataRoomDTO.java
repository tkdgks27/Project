package com.cip.Admin;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

public class DataRoomDTO {
	@Id
	@SequenceGenerator(sequenceName="pro_one_dataroom_seq", name="pods", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "pods")
	@Column(name="pro_fileName")
	private String fileName;
	
	@Column(name="pro_uploader")
	private String uploader;
	
	@Column(name="pro_date")
	private Date date;
}
