package com.cip.Admin;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DataRoom {
	
	@Value("${dataRoom.folder.path}")
	private String dataRoom;
	@Value("${seperate.folder.path}")
	private String seperateData;
	
	public String getPath() {
		return seperateData;
	}
	@Value("${cip.folder.path}")
	private String folderpath;
	
	// 파일 분할업로드
	public synchronized boolean uploadFile(MultipartFile mf,
											int chunkNumber, int totalChunks) {
		String fileName = mf.getOriginalFilename() + ".part" + chunkNumber ;
		Path seperPath = Paths.get(seperateData, fileName);
		Path dataPath = Paths.get(dataRoom);
		try {
			Files.write(seperPath, mf.getBytes());
		} catch (IOException e) {
			System.out.println("파일쓰기실패");
			e.printStackTrace();
		}
		
		if(chunkNumber == totalChunks -1) {
			for(int i = 0; i< totalChunks; i++) {
				Path chunkFile = Paths.get(seperateData, mf.getOriginalFilename() + ".part" + i);
				try {
					Files.write(dataPath, Files.readAllBytes(chunkFile), StandardOpenOption.APPEND);
					Files.delete(chunkFile);
				} catch (IOException e) {
					System.out.println("파일합성실패");
					e.printStackTrace();
				}
			}
			return true;
		}
		return false;
	}
	
//	파일다운
	public ResponseEntity<Resource> getFile(String fileName) {
		try {
			UrlResource ur = new UrlResource(dataRoom + File.separator + fileName);
			String h = "attachment; filename=\"" + URLEncoder.encode(fileName, "utf-8") + "\"";
			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, h).body(ur);
		} catch (Exception e) {
			System.out.println("파일다운 실패");
			e.printStackTrace();
		}
		return null;
	}
}
