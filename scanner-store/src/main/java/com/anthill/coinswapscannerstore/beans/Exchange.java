package com.anthill.coinswapscannerstore.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
public class Exchange implements Serializable {

    private long id;
    private String title;
    private Quote quote;
}
