package com.cip.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FileDTO {
	private String fileName;
	private int chunkNumber;
	private int totalChunks;
}
