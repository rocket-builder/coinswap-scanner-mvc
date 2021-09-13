package com.anthill.coinswapscannermvc.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@NoArgsConstructor
@Getter @Setter
@Entity
public class Settings extends AbstractEntity{

    private double minProfitPercent = 5;
    private double maxProfitPercent = 200;

    private double minTokenVolume = 10;
    private double maxTokenVolume = 100000000;
}
