package com.anthill.coinswapscannermvc.controllers.mvc;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.exceptions.IncorrectPasswordException;
import com.anthill.coinswapscannermvc.exceptions.UserNotFoundedException;
import com.anthill.coinswapscannermvc.repos.UserRepos;
import com.anthill.coinswapscannermvc.security.MD5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    UserRepos userRepos;

    @RequestMapping(value = {"/", "/index", "login"}, method = RequestMethod.GET)
    public String index(){
        return "index";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) throws UserNotFoundedException,
            IncorrectPasswordException {
        User authorized = userRepos.findByLogin(user.getLogin());

        if(authorized != null){
            if(authorized.getPassword().equals(MD5.getHash(user.getPassword()))){

                session.setAttribute("user", user);
                return "profile";
            }
            throw new IncorrectPasswordException();
        }
        throw new UserNotFoundedException();
    }

    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "index";
    }
}
