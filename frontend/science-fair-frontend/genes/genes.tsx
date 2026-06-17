import { rbool, ritem } from "./util";

/**
 * A Gene; has a phenotype depending on its dominance.
 */
export type Gene = "A";
export const GENES: Gene[] = ["A"];

/**
 * Variations of an Allele of a Gene. 
 */
export enum Allele {
    BIG,
    SMALL,
}

/**
 * A pair of Alleles.
 */
export type AllelePair = [Allele, Allele];

/**
 * A textual description of an Allele pair.
 */
export type AllelePairDesc = "heterozygous" | "homozygous_recessive" | "homozygous_dominant";

/**
 * Gets an Allele Pair from a description of that Allele Pair.
 * 
 * @param description The description of the Allele pair.
 * @returns An Allele pair that matches the description.
 */
export function alleles_from_desc(description: AllelePairDesc): AllelePair {
    // deal with all homozygous pairs
    if (description.startsWith("homo")) {
        const both: Allele = description.endsWith("dominant") ? Allele.BIG : Allele.SMALL;
        return [both, both];
    }

    // get the first element of the allele pair as a random choice
    const first = rbool() ? Allele.BIG : Allele.SMALL;
    // define the second element as the opposite of the first element
    const second = first == Allele.BIG ? Allele.SMALL : Allele.BIG;

    return [first, second];
}


/**
 * Gets an AllelePairDesc from a pair of Alleles.
 * 
 * @param alleles Allele pair.
 * @returns The description of an AllelePair.
 */
export function desc_from_alleles(alleles: AllelePair): AllelePairDesc {
    if (alleles[0] == alleles[1]) {
        if (alleles[0] == Allele.BIG) {
            return "homozygous_dominant";
        }
        return "homozygous_recessive";
    }
    return "heterozygous";
}

/**
 * Whether or not a Trait is Dominant or Recessive; product of its Allele Size.
 */
enum Dominance {
    DOMINANT,
    RECESSIVE,
}

/**
 * Phenotype; physical representation of Trait.
 */
type PhenoType = string;

/**
 * Map<Gene, Phenotype[]> where the Phenotype[] is indexed by Dominance.
 */
const PHENOTYPES: Record<Gene, [PhenoType, PhenoType]> = {
    "A": ["/red.png", "/blue.png"],
}

/**
 * Gets a phenotypical expression for the given gene.
 * 
 * @param gene       The gene.
 * @param dominance  The dominance.
 * @returns A Pehnotype representation.
 */
export function get_phenotype(gene: Gene, dominance: Dominance) {
    return PHENOTYPES[gene][dominance];
}

/**
 * A Trait; representation of a Gene and a pair of alleles of that Gene of a
 * given Size.
 */
export class Trait {
    readonly gene: Gene;
    readonly alleles: AllelePair;

    constructor(gene: Gene, alleles: AllelePair) {
        this.gene = gene;
        this.alleles = alleles;
    }

    get_dominance(): Dominance {
        return this.alleles[0] == Allele.BIG || this.alleles[1] == Allele.BIG ? Dominance.DOMINANT : Dominance.RECESSIVE;
    }

    get_phenotype(): PhenoType {
        const dominance: Dominance = this.get_dominance();
        return PHENOTYPES[this.gene][dominance];
    }

    fmt_alleles(): string {
        const upper = this.gene.toUpperCase();
        const lower = this.gene.toLocaleLowerCase();

        const first = this.alleles[0] == Allele.BIG ? upper : lower;
        const second = this.alleles[1] == Allele.BIG ? upper : lower;

        return first + second;
    }
}

/**
 * Generates a probable Trait given the two progenitors.
 * 
 * @param first The first progenitor.
 * @param second  The second progenitor.
 * @returns A probable trait combination of the two progenitors.
 */
export function mix_traits(first: Trait, second: Trait): Trait | null {
    if (first.gene != second.gene) {
        return null;
    }

    let possibilities: AllelePair[] = []
    for (const outer of first.alleles) {
        for (const inner of second.alleles) {
            possibilities.push([outer, inner]);
        }
    }

    const selected = ritem(possibilities);
    return new Trait(first.gene, selected);
}

