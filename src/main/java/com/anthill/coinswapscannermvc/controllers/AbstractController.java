package com.anthill.coinswapscannermvc.controllers;

import com.anthill.coinswapscannermvc.beans.AbstractEntity;
import com.anthill.coinswapscannermvc.exceptions.ResourceNotFoundedException;
import com.anthill.coinswapscannermvc.interfaces.CommonController;
import com.anthill.coinswapscannermvc.repos.CommonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public abstract class AbstractController<E extends AbstractEntity, R extends CommonRepository<E>>
    implements CommonController<E> {

    protected final R repos;

    protected AbstractController(R repos) {
        this.repos = repos;
    }

    @Override
    public ResponseEntity<E> save(@RequestBody E entity) throws Exception {
        E res = repos.save(entity);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<E> update(@RequestBody E entity) throws Exception {
        E res = repos.save(entity);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<E> findById(@PathVariable("id") long id) throws ResourceNotFoundedException {
        E entity = repos.findById(id);
        if(entity != null){
            return new ResponseEntity<>(entity, HttpStatus.OK);
        }

        throw new ResourceNotFoundedException();
    }
    @Override
    public ResponseEntity<List<E>> findAll() {
        List<E> entities = repos.findAll();

        return new ResponseEntity<>(entities, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<E> deleteById(@PathVariable("id") long id) throws ResourceNotFoundedException {
        E entity = repos.findById(id);
        if(entity != null){
            repos.delete(entity);

            return new ResponseEntity<>(entity, HttpStatus.OK);
        }

        throw new ResourceNotFoundedException();
    }
    @Override
    public ResponseEntity<E> delete(@RequestBody E entity) throws ResourceNotFoundedException {
        if(repos.findById(entity.getId()) != null){
            repos.delete(entity);

            return new ResponseEntity<>(entity, HttpStatus.OK);
        }

        throw new ResourceNotFoundedException();
    }
}
