package com.anthill.coinswapscannermvc.beans.coinmarket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
public class Token implements Serializable {

    private int id;
    private String title, slug, symbol;

    private Platform platform;
    private Quote quote;
}
