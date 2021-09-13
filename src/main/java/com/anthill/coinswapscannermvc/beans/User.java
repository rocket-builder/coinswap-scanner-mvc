package com.anthill.coinswapscannermvc.beans;

import com.anthill.coinswapscannermvc.enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Getter @Setter
@NoArgsConstructor
@Entity
public class User extends AbstractEntity {

    private String login, password;

    @OneToOne(cascade = CascadeType.ALL)
    Settings settings = new Settings();

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date subscribe = new Date();

    private long telegramId;
    private boolean banned;

    public String getFormattedDateString(){
        return new SimpleDateFormat("yyyy-MM-dd").format(subscribe);
    }
}

