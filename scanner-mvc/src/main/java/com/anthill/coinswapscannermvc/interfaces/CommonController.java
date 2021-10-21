package com.anthill.coinswapscannermvc.interfaces;

import com.anthill.coinswapscannermvc.beans.AbstractEntity;
import com.anthill.coinswapscannermvc.exceptions.ResourceNotFoundedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

public interface CommonController<E extends AbstractEntity> {

    @PostMapping
    ResponseEntity<E> save(@RequestBody E entity) throws Exception;

    @PutMapping
    ResponseEntity<E> update(@RequestBody E entity) throws Exception;

    @GetMapping("/{id}")
    ResponseEntity<E> findById(@PathVariable("id") long id) throws ResourceNotFoundedException;
    @GetMapping
    ResponseEntity<List<E>> findAll();

    @DeleteMapping("/{id}")
    ResponseEntity<E> deleteById(@PathVariable("id") long id) throws ResourceNotFoundedException;
    @DeleteMapping
    ResponseEntity<E> delete(E entity) throws ResourceNotFoundedException;
}
