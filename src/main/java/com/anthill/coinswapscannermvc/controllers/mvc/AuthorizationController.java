package com.anthill.coinswapscannermvc.controllers.mvc;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.enums.Role;
import com.anthill.coinswapscannermvc.exceptions.AccessDeniedException;
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
import java.util.Date;

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
        return "redirect:/";
    }

    @PostMapping("/login")
    public String login(@RequestBody User userAuth, HttpSession session) throws UserNotFoundedException,
            IncorrectPasswordException, AccessDeniedException {
        User authorized = userRepos.findByLogin(userAuth.getLogin());

        if(authorized == null){
            throw new UserNotFoundedException();
        }
        if(!authorized.getPassword().equals(MD5.getHash(userAuth.getPassword()))){
            throw new IncorrectPasswordException();
        }
        if(authorized.getRole().equals(Role.USER)){
            if(authorized.isBanned() || authorized.getSubscribe().before(new Date())){
                throw new AccessDeniedException();
            }
        }

        session.setAttribute("user", authorized);
        return getViewByRole(authorized);
    }

    @PostMapping("/registration")
    public String registration(@RequestBody User user, HttpSession session) throws LoginAlreadyTakenException {
        if(userRepos.existsByLogin(user.getLogin())){
            throw new LoginAlreadyTakenException();
        }

        String passwordHash = MD5.getHash(user.getPassword());
        user.setPassword(passwordHash);
        User saved = userRepos.save(user);

        session.setAttribute("user", saved);
        return getViewByRole(saved);
    }

    private String getViewByRole(User user){
        String view;
        switch (user.getRole()){
            case ADMIN: view = "admin"; break;
            case USER:
            default: view = "profile"; break;
        }
        return view;
    }
}
