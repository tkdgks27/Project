package com.cip.Member;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ValidationCodeJson {
	private List<ValidationCodeDTO> verificationCode;
}
