package com.anthill.coinswapscannermvc.controllers.mvc;

import com.anthill.coinswapscannermvc.beans.Settings;
import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.enums.Role;
import com.anthill.coinswapscannermvc.exceptions.AccessDeniedException;
import com.anthill.coinswapscannermvc.repos.SettingsRepos;
import com.anthill.coinswapscannermvc.repos.UserRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class PagesController {

    @Autowired
    UserRepos userRepos;
    @Autowired
    SettingsRepos settingsRepos;

    @GetMapping("/telegram")
    public String telegram(HttpSession session){
        return getViewByUserSession("telegram", session);
    }

    @GetMapping("/shops")
    public String shops(HttpSession session){
        return getViewByUserSession("shops", session);
    }

    @GetMapping("/profile")
    public String profile(HttpSession session) {
        return getViewByUserSession("profile", session);
    }

    @GetMapping("/settings")
    public String settings(HttpSession session) throws AccessDeniedException {
        User user = (User) session.getAttribute("user");
        if(user == null){
            throw new AccessDeniedException();
        }

        Settings settings = settingsRepos.findById(user.getSettings().getId());
        user.setSettings(settings);

        session.setAttribute("user", user);
        return "settings";
    }

    @GetMapping("/admin")
    public String admin(Model model, HttpSession session) {
        User admin = (User) session.getAttribute("user");

        if(admin != null && admin.getRole().equals(Role.ADMIN)) {
            model.addAttribute("users", userRepos.findAllByRole(Role.USER));
            return "admin";
        }
        return "access-denied";
    }

    private String getViewByUserSession(String view, HttpSession session){
        if(session.getAttribute("user") == null){
            view = "access-denied";
        }
        return view;
    }
}
