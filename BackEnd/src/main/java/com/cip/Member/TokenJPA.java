package com.cip.Member;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TokenJPA extends CrudRepository<saveJWT, String>{
	public abstract List<saveJWT> findByIdLike(String s);
	
	@Transactional
	@Modifying
	@Query(value = "update jwttoken t set t.accesss = :newAccess where id = :getid and :newAccess != t.accesss")
	void updateById(@Param("newAccess") String newAccessValue, @Param("getid") String getid);

}
