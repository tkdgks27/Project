package com.cip.Admin;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
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
	
//	public void uploadData(DataRoomDTO dDTO, MultipartFile mf, File f) {
//		try {
//			String fileName = mf.getOriginalFilename();
//			String type = fileName.substring(fileName.lastIndexOf("."));
//			String uuid = UUID.randomUUID().toString();
//			fileName = fileName + uuid + type;
//			mf.transferTo(new File(dataRoom + File.separator + fileName));
//		} catch (IllegalStateException e) {
//			System.out.println("파일을 넣어주세요");
//			e.printStackTrace();
//		} catch (IOException e) {
//			System.out.println("파일 형식이 잘못되었습니다");
//			e.printStackTrace();
//		}
//	}
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
	
//	public Resource getFile(String fileName) {
//		return new UrlResource("file:" + dataRoom + File.separator + fileName)
//	}
}
