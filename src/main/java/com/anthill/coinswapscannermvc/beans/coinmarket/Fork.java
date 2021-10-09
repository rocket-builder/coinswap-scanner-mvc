package com.anthill.coinswapscannermvc.beans.coinmarket;

import com.anthill.coinswapscannermvc.beans.AbstractEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@NoArgsConstructor
@Getter @Setter
@Entity
public class Fork extends AbstractEntity {

    private String url;
}
