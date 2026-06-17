package com.backend.sciencefairbackend.model;
import java.util.ArrayList;

public class Organism {
    private ArrayList<Trait> traits;

    Organism() {
        this.traits = new ArrayList<Trait>();
    }

    Organism(ArrayList<Trait> traits) {
        this.traits = traits;
    }

    public void addTrait(Trait trait) {
        this.traits.add(trait);
    }

}
