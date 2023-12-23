package com.cip.Community;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JPQL extends JpaRepository<CommunityDTO, Integer>{
	@Query("SELECT proId, com_Title, com_Date " +
	           "FROM ProMember c, ProCommunity p " +
	           "WHERE pro_Id = com_id " +
	           "ORDER BY com_Date DESC")
	List<Object[]> findCustomQueryResults();
}
