package com.anthill.coinswapscannermvc.repos;

import com.anthill.coinswapscannermvc.beans.AbstractEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface CommonRepository<E extends AbstractEntity> extends CrudRepository<E, Long> {

    E findById(long id);
    List<E> findAll();
}
