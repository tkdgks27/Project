package com.cip.Admin;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataRoomJPA extends CrudRepository<DataRoomDTO, String>{
	
}
