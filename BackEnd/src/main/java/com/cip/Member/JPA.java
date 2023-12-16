package com.cip.Member;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JPA extends CrudRepository<ResMemberDTO, String>{
	public abstract List<ResMemberDTO> findByIdLike(String id);
	public abstract List<ResMemberDTO> findByEmailLike(String email);
//	public abstract List<Member>
//	public abstract List<Member>
	public abstract List<ResMemberDTO> findById(ResMemberJson resmj);
}
