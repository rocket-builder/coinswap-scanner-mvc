package com.anthill.coinswapscannermvc.beans;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import java.util.Objects;

@NoArgsConstructor
@Getter @Setter
@Entity
public class Pair extends AbstractEntity {

    private String title;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pair pair = (Pair) o;
        return Objects.equals(title, pair.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title);
    }
}
