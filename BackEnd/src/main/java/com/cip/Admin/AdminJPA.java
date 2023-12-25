package com.cip.Admin;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AdminJPA extends CrudRepository<adminDTO, String>{
	public abstract List<adminDTO> findByEmail(String s);
	public abstract List<adminDTO> save(String email);
}
