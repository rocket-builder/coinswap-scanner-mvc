package com.anthill.coinswapscannermvc.controllers.mvc;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.enums.Role;
import com.anthill.coinswapscannermvc.exceptions.IncorrectPasswordException;
import com.anthill.coinswapscannermvc.exceptions.LoginAlreadyTakenException;
import com.anthill.coinswapscannermvc.exceptions.UserNotFoundedException;
import com.anthill.coinswapscannermvc.repos.UserRepos;
import com.anthill.coinswapscannermvc.security.MD5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class AuthorizationController {

    @Autowired
    UserRepos userRepos;

    @RequestMapping(value = {"/", "/login"}, method = RequestMethod.GET)
    public String index(HttpSession session) {
        String view = "index";
        if(session.getAttribute("user") != null){
            view = "profile";
        }

        return view;
    }

    @GetMapping("/registration")
    public String registration(){
        return "registration";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "index";
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User userAuth, HttpSession session) throws UserNotFoundedException,
            IncorrectPasswordException {
        User authorized = userRepos.findByLogin(userAuth.getLogin());

        if(authorized == null){
            throw new UserNotFoundedException();
        }
        if(!authorized.getPassword().equals(MD5.getHash(userAuth.getPassword()))){
            throw new IncorrectPasswordException();
        }

        session.setAttribute("user", authorized);
        return new ResponseEntity<>(authorized, HttpStatus.OK);
    }

    @PostMapping("/registration")
    public ResponseEntity<User> registration(@RequestBody User user, HttpSession session) throws LoginAlreadyTakenException {
        if(userRepos.existsByLogin(user.getLogin())){
            throw new LoginAlreadyTakenException();
        }

        String passwordHash = MD5.getHash(user.getPassword());
        user.setPassword(passwordHash);
        User saved = userRepos.save(user);

        session.setAttribute("user", saved);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }
}
