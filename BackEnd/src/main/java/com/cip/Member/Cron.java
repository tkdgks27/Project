package com.cip.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Cron {
	@Autowired
	TokenJPA tjpa;

	@Scheduled(cron="0 0 6 1/3 * ?")
	public void refreshToken() {
		tjpa.deleteRefresh(".");
		System.out.println("done");
	}
}
