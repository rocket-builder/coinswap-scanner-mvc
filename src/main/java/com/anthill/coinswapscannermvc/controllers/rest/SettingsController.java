package com.anthill.coinswapscannermvc.controllers.rest;

import com.anthill.coinswapscannermvc.beans.Settings;
import com.anthill.coinswapscannermvc.controllers.AbstractController;
import com.anthill.coinswapscannermvc.repos.SettingsRepos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/user/settings")
@RestController
public class SettingsController extends AbstractController<Settings, SettingsRepos> {
    protected SettingsController(SettingsRepos repos) {
        super(repos);
    }
}
