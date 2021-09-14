package com.anthill.coinswapscannermvc.controllers.rest;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.constants.ResponseMessage;
import com.anthill.coinswapscannermvc.controllers.AbstractController;
import com.anthill.coinswapscannermvc.exceptions.LoginAlreadyTakenException;
import com.anthill.coinswapscannermvc.exceptions.UserNotFoundedException;
import com.anthill.coinswapscannermvc.repos.UserRepos;
import com.anthill.coinswapscannermvc.security.MD5;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.function.Function;

@RequestMapping("/user")
@RestController
public class UserController extends AbstractController<User, UserRepos> {

    protected UserController(UserRepos repos) {
        super(repos);
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrent(HttpSession session) throws UserNotFoundedException {
        User sessionUser = (User) session.getAttribute("user");
        if(sessionUser != null){
            User user = repos.findById(sessionUser.getId());

            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        throw new UserNotFoundedException();
    }

    @Override
    public ResponseEntity<User> save(@RequestBody User entity) throws LoginAlreadyTakenException {
        if(repos.existsByLogin(entity.getLogin())){
            throw new LoginAlreadyTakenException();
        }

        String passwordHash = MD5.getHash(entity.getPassword());
        entity.setPassword(passwordHash);

        User saved = repos.save(entity);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @PutMapping("/{id}/telegram")
    public ResponseEntity<String> updateTelegram(@PathVariable("id") long userId, @RequestBody User update)
            throws UserNotFoundedException {

        updateExistUser(repos -> repos.updateTelegram(userId, update.getTelegramId()));
        return new ResponseEntity<>(ResponseMessage.UPDATED, HttpStatus.OK);
    }

    @PutMapping("/{id}/subscribe")
    public ResponseEntity<String> updateSubscription(@PathVariable("id") long userId,
                                                     @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date)
            throws UserNotFoundedException {

        updateExistUser(repos -> repos.updateSubscribe(userId, date));
        return new ResponseEntity<>(ResponseMessage.UPDATED, HttpStatus.OK);
    }

    @PutMapping("/{id}/banned")
    public ResponseEntity<String> updateBanned(@PathVariable("id") long userId, @RequestBody User update)
            throws UserNotFoundedException {

        updateExistUser(repos -> repos.updateBanned(userId, update.isBanned()));
        return new ResponseEntity<>(ResponseMessage.UPDATED, HttpStatus.OK);
    }

    private void updateExistUser(Function<UserRepos, Integer> updateAction) throws UserNotFoundedException {
        int rows = updateAction.apply(repos);
        if(rows == 0) {
            throw new UserNotFoundedException();
        }
    }
}
