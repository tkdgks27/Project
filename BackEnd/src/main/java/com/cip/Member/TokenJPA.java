package com.cip.Member;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenJPA extends CrudRepository<refreshJWT, String>{
	
}