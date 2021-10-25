package com.anthill.coinswapscannermvc.beans.coinmarket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@NoArgsConstructor
@Getter
@Setter
public class ForkList {
    private ArrayList<Fork> items;
}
