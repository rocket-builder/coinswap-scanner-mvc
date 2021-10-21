package com.anthill.coinswapscannermvc.controllers.rest;

import com.anthill.coinswapscannermvc.beans.coinmarket.Fork;
import com.anthill.coinswapscannermvc.services.ForkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/fork")
@RestController
public class ForkController {

    private final ForkService forkService;

    public ForkController(ForkService forkService) {
        this.forkService = forkService;
        this.forkService.init();
    }

    @GetMapping()
    public ResponseEntity<Iterable<Fork>> getAll(){
        return new ResponseEntity<>(
                forkService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/delete")
    public ResponseEntity<String> deleteAll(){
        forkService.deleteAll();

        return new ResponseEntity<>(
                "Successfully deleted!", HttpStatus.OK);
    }
}
