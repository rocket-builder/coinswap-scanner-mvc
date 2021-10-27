package com.anthill.coinswapscannermvc.interfaces;

import com.anthill.coinswapscannermvc.exceptions.ResourceNotFoundedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface CommonController<T> {

    ResponseEntity<T> save(@RequestBody T entity) throws Exception;

    ResponseEntity<T> update(@RequestBody T entity) throws Exception;

    ResponseEntity<T> findById(@PathVariable("id") long id) throws ResourceNotFoundedException;

    ResponseEntity<List<T>> findAll();

    ResponseEntity<T> deleteById(@PathVariable("id") long id) throws ResourceNotFoundedException;

    ResponseEntity<T> delete(@RequestBody T entity) throws ResourceNotFoundedException;
}
