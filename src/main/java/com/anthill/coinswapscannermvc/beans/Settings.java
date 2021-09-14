package com.anthill.coinswapscannermvc.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@NoArgsConstructor
@Getter @Setter
@Entity
public class Settings extends AbstractEntity{

    private double minProfitPercent;
    private double maxProfitPercent;

    private double minTokenVolume;
    private double maxTokenVolume;

    private double minPairVolume;
    private double maxPairVolume;
}
