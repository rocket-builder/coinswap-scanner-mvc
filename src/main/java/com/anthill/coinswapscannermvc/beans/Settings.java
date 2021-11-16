package com.anthill.coinswapscannermvc.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

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

    private int maxForkCountOnPage = 100;

    private String exchanges = "";

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Pair> bannedPairs = new HashSet<>();
}
