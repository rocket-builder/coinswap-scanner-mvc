package com.anthill.coinswapscannermvc.dto;

import com.anthill.coinswapscannermvc.beans.coinmarket.Fork;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class ForkListDto {
    private ArrayList<Fork> items;
}
