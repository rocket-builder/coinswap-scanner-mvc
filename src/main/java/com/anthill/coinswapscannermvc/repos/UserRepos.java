package com.anthill.coinswapscannermvc.repos;

import com.anthill.coinswapscannermvc.beans.User;
import com.anthill.coinswapscannermvc.enums.Role;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Repository
@Transactional
public interface UserRepos extends CommonRepository<User> {

    boolean existsByLogin(String login);
    User findByLogin(String login);
    List<User> findAllByRole(Role role);

    @Modifying
    @Query("update User u set u.banned = :banned where u.id = :id")
    int updateBanned(@Param("id") long id, @Param("banned") boolean banned);

    @Modifying
    @Query("update User u set u.telegramId = :telegramId where u.id = :id")
    int updateTelegram(@Param("id") long id, @Param("telegramId") long telegramId);

    @Modifying
    @Query("update User u set u.subscribe = :subscribe where u.id = :id")
    int updateSubscribe(@Param("id") long id, @Param("subscribe") Date subscribe);
}
