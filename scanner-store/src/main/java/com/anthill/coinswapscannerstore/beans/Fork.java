package com.anthill.coinswapscannerstore.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@Getter @Setter
@RedisHash("Fork")
public class Fork implements Serializable {

    @Id
    @Indexed
    private String id;

    private String url;
    private Date recieveDate;
}

