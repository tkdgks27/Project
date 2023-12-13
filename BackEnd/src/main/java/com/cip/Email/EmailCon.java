package com.cip.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cip.Member.JPA;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class EmailCon {
    @Autowired
    private EmailDAO eDAO;
    @Autowired JPA jpa;
    
    
}