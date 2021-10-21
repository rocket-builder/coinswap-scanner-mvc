package com.anthill.coinswapscannermvc.beans.coinmarket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
public class Quote implements Serializable {

    private UsdPrice usdPrice;
}
