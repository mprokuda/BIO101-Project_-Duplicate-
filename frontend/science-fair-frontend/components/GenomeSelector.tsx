import React from "react";
import styles from "./GenomeSelector.module.css";
import { random_alleles } from "../genes/person";
import { AllelePair, AllelePairDesc, alleles_from_desc } from "../genes/genes";

/**
 * Selection for an Allele pair value.
 */
export type GenomeSelection = "random" | AllelePairDesc;

/**
 * Type for a handler of a GenomSelector value.
 */
type GenomeSelectHandler = (selection: GenomeSelection, parent_id: number) => void;

export function GenomeSelector({ parent_id, onChange }: { parent_id: number, onChange: GenomeSelectHandler }) {
    const handleChange = (event: any) => {
        let value: GenomeSelection = event.currentTarget.value;
        onChange(value, parent_id);
    }

    const rinput_name = "genome" + parent_id;
    const htmlfor_name = "contact-choice" + parent_id;

    return (
        <div>
            <h1 className={styles["container-header"]}>Parent {parent_id + 1}</h1>
            <div className={styles["bubble-field"]}>
                <div>
                    <input type="radio" name={rinput_name} value="random" onClick={handleChange} defaultChecked />
                    <label htmlFor={htmlfor_name}>Random</label>
                </div>

                <div>
                    <input type="radio" name={rinput_name} value="heterozygous" onClick={handleChange} />
                    <label htmlFor={htmlfor_name}>Heterozygous</label>
                </div>

                <div>
                    <input type="radio" name={rinput_name} value="homozygous_recessive" onClick={handleChange} />
                    <label htmlFor={htmlfor_name}>Homozygous Recessive</label>
                </div>

                <div>
                    <input type="radio" name={rinput_name} value="homozygous_dominant" onClick={handleChange} />
                    <label htmlFor={htmlfor_name}>Homozygous Dominant</label>
                </div>
            </div>
        </div>
    );
}

/**
 * Converts a selection to a pair of Alleles.
 * 
 * @param selection The selected element of the GenomeSelector.
 * @returns A pair of Alleles that fits the given value.
 */
export function selection_to_alleles(selection: GenomeSelection): AllelePair {
    if (selection == "random") {
        return random_alleles();
    }
    return alleles_from_desc(selection);
}