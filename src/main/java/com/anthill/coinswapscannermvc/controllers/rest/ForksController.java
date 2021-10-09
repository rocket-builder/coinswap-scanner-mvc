package com.anthill.coinswapscannermvc.controllers.rest;


import com.anthill.coinswapscannermvc.beans.coinmarket.Fork;
import com.anthill.coinswapscannermvc.controllers.AbstractController;
import com.anthill.coinswapscannermvc.repos.ForkRepos;
import com.anthill.coinswapscannermvc.services.ForkService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ForksController extends AbstractController<Fork, ForkRepos> {

    private final ForkService forkService;

    protected ForksController(ForkRepos repos, ForkService forkService) {
        super(repos);
        this.forkService = forkService;

        this.forkService.init();
    }
}
