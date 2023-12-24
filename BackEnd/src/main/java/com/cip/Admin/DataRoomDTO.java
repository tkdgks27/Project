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
@Entity(name="pro_dataroom")
public class DataRoomDTO {
	@Id
	@SequenceGenerator(sequenceName="pro_one_dataroom_seq", name="pods", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "pods")
	@Column(name="data_num")
	private String num;
	
	@Column(name="data_id")
	private String id;
	
	@Column(name="data_file")
	private String file;
}