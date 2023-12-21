package com.cip.Member;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
@Repository
public interface JPA extends CrudRepository<ResMemberDTO, Integer>{
	public abstract List<ResMemberDTO> findByIdLike(String id);
	public abstract List<ResMemberDTO> findById(ResMemberJson resmj);
	public abstract List<ResMemberDTO> findByEmailLike(String email);
	
	public abstract List<ResMemberDTO> deleteByEmailLike(String email);
	public abstract List<ResMemberDTO> deleteByIdLike(String s);
	public abstract List<ResMemberDTO> deleteById(String ss);
	
	
}
