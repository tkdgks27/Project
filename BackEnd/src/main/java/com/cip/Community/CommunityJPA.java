package com.cip.Community;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityJPA extends CrudRepository<CommunityDTO, Integer>{
	public abstract List<CommunityDTO> deleteByNum(Integer i);
	public abstract List<CommunityDTO> findByNum(Integer ii);
	public abstract List<CommunityDTO> findById(String ss);
	public abstract List<CommunityDTO> deleteById(String s);
	public abstract List<CommunityDTO> save(List<CommunityDTO> findById);
	public abstract List<CommunityDTO> findByDateAcs();
	public abstract List<CommunityDTO> findByTitleContaining(String sss, Pageable p);
}
