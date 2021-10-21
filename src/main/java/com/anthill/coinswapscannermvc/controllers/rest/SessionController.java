package com.anthill.coinswapscannermvc.controllers.rest;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.exceptions.ResourceNotFoundedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RequestMapping("/session")
@RestController
public class SessionController {

    @GetMapping("/user")
    public ResponseEntity<User> getUserFromSession(HttpSession session) throws ResourceNotFoundedException {
        User user = (User) session.getAttribute("user");
        if(user != null){

            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        throw new ResourceNotFoundedException("session");
    }
}
