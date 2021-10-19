package com.anthill.coinswapscannerstore.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@Getter @Setter
public class Fork implements Serializable {

    private String url;
    private Date recieveDate;
}

