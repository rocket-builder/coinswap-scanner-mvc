package com.anthill.coinswapscannermvc.repos;

import com.anthill.coinswapscannermvc.beans.User;

public interface UserRepos extends CommonRepository<User> {

    boolean existsByLogin(String login);
    User findByLogin(String login);
}
