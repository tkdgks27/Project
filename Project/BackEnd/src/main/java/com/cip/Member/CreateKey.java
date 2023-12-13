package com.cip.Member;

import java.security.SecureRandom;
import java.util.Random;

import org.springframework.stereotype.Service;
@Service
public class CreateKey {
	
	private String key;
	
    public String generateKey(int length) {
        StringBuilder sb = new StringBuilder();
        SecureRandom ran = new SecureRandom();

        for (int i = 0; i < length; i++) {
            long randomKey = ran.nextInt(10);
            sb.append(randomKey);
        }
        return sb.toString();
    }

}
