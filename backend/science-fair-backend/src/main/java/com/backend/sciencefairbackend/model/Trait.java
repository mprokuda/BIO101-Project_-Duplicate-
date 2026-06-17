package com.backend.sciencefairbackend.model;

public class Trait {
    private int dominant, recessive;

    Trait() {
        this.dominant = (int)Math.floor(Math.random() * (2-0+1) + 0);
        this.recessive = (int)Math.floor(Math.random() * (2-0+1) + 0);
    }

    Trait(int dominant, int recessive) {
        this.dominant = dominant;
        this.recessive = recessive;
    }

    public int getDominant() {
        return this.dominant;
    }

    public int getRecessive() {
        return this.recessive;
    }
    
}
