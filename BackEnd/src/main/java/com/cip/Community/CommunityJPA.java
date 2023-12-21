package com.cip.Community;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityJPA extends CrudRepository<CommunityDTO, Integer>{
	public abstract List<CommunityDTO> deleteByNum(Integer i);
	public abstract List<CommunityDTO> findByNum(Integer ii);
}
