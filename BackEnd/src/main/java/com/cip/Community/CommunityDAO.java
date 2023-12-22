package com.cip.Community;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.chrono.JapaneseChronology;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cip.Member.JPA;
import com.cip.Member.JwtToken;
import com.cip.Member.MemberDAO;
import com.cip.Member.ResMemberDTO;

@Service
public class CommunityDAO {
	@Autowired
	JPA jpa;
	@Autowired
	CommunityJPA cjpa;
	@Autowired
	MemberDAO mDAO;
	private SimpleDateFormat sdf;
	
	@Value("${cip.folder.path}")
	private String folderpath;
	
	public CommunityDAO() {
		sdf = new SimpleDateFormat("yyyyMMddHHmm");
	}
	
	
	public CommunityDTO post(JwtToken mjwt,CommunityDTO cDTO, MultipartFile mf) {
		ResMemberDTO token = mDAO.parseJWT(mjwt);
		if(token != null) {
		cDTO.setId(token.getId());
		try {
			if(mf != null && !mf.isEmpty()) {
			String fileName = mf.getOriginalFilename();
			String type = fileName.substring(fileName.lastIndexOf("."));
			String uuid = UUID.randomUUID().toString();
			fileName = fileName.replace(type, "");
			fileName = fileName + uuid + type;
			cDTO.setFile(fileName);
				try {
					mf.transferTo(new File(folderpath + File.separator + fileName));
				} catch (IOException e) {
					System.out.println("파일전송오류");
					return null;
				}
			}
			
			cDTO.setDate(sdf.parse(sdf.format(new Date())));
			cDTO.setId(mDAO.parseJWT(mjwt).getId());
			
		} catch (ParseException e) {
			System.out.println("날짜 파싱 오류");
		}
		return cjpa.save(cDTO);
		
		}
		return null;
	}
	
}
