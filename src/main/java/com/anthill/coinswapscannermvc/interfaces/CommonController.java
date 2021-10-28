package com.anthill.coinswapscannermvc.interfaces;

import com.anthill.coinswapscannermvc.exceptions.ResourceNotFoundedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface CommonController<E> {

    @PostMapping
    ResponseEntity<E> save(@RequestBody E entity) throws Exception;

    @PutMapping
    ResponseEntity<E> update(@RequestBody E entity) throws ResourceNotFoundedException;

    @GetMapping("/single")
    ResponseEntity<E> findById(@RequestParam long id) throws ResourceNotFoundedException;
    @GetMapping
    ResponseEntity<List<E>> findAll();

    @DeleteMapping("/single")
    ResponseEntity<E> deleteById(@RequestParam long id) throws ResourceNotFoundedException;
    @DeleteMapping
    ResponseEntity<E> delete(E entity) throws ResourceNotFoundedException;
}
