package com.cip.Member;

import java.security.SecureRandom;
import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Service;
@Service
public class CreateKey {
	
    public static String generateKey() {
    	UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
    
//    public static String generateEmailKey(Integer length) {
//    	
//    }
}
