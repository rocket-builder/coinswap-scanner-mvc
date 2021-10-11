package com.anthill.coinswapscannerstore.repos;

import com.anthill.coinswapscannerstore.beans.Fork;
import org.springframework.data.keyvalue.repository.KeyValueRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForkRepos extends KeyValueRepository<Fork, String> {}
