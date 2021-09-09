package com.anthill.coinswapscannermvc.controllers.rest;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.controllers.AbstractController;
import com.anthill.coinswapscannermvc.exceptions.UserNotFoundedException;
import com.anthill.coinswapscannermvc.repos.UserRepos;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("user")
@RestController
public class UserController extends AbstractController<User, UserRepos> {

    protected UserController(UserRepos repos) {
        super(repos);
    }

    @PutMapping("/{id}/telegram")
    public ResponseEntity<User> updateTelegram(@PathVariable("id") long userId, @RequestBody User update) throws UserNotFoundedException {
        User user = repos.findById(userId);

        if(user != null){
            user.setTelegramId(update.getTelegramId());
            User saved = repos.save(user);

            return new ResponseEntity<>(saved, HttpStatus.OK);
        }
        throw new UserNotFoundedException();
    }
}
