package com.anthill.coinswapscannermvc.beans;

import com.anthill.coinswapscannermvc.enums.Role;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;

@Getter @Setter
@NoArgsConstructor
@Entity
public class User extends AbstractEntity {

    private String login, password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Date subscribe;

    private long telegramId;
}

