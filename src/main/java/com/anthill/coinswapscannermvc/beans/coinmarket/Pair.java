package com.anthill.coinswapscannermvc.beans.coinmarket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class Pair implements Serializable {

    private String title;

    private Exchange exchange;

    private Date updated;
    private BigDecimal price, volume24h;
}
