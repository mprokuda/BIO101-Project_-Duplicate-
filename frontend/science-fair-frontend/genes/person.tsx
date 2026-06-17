import { Allele, AllelePair, Trait, Gene, GENES, mix_traits } from './genes';
import { rbool, ritem } from './util';

const NAMES = {
    "male": ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Andrew", "Paul", "Joshua"],
    "female": ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret", "Ashley", "Kimberly", "Emily", "Donna", "Michelle"],
}

/**
 * The Sex of the Person.
 */
export type Sex = "male" | "female";

/**
 * A Person's Genome.
 */
type Genome = Trait[];

/**
 * A Person in our simulation; has a series of traits.
 */
export type Person = {
    sex: Sex;
    name: string;
    genome: Genome;
    outside: boolean;
}



/**
 * Generate a number of children. 
 * 
 * @param first   The first progenitor.
 * @param second  The second progenitor.
 * @param size    The number of children to make.
 * @returns A probable child of the two progenitors.
 */
export function generate_children(first: Person, second: Person, size: number): Person[] {
    let people = [];
    for (let i = 0; i < size; i++) {
        people.push(generate_child(first, second));
    }
    return people;
}

/**
 * Generate a probable child of two People.
 * 
 * @param first   The first progenitor.
 * @param second  The second progenitor.
 * @returns A probable child of the two progenitors.
 */
export function generate_child(first: Person, second: Person): Person {
    const sex = rbool() ? "male" : "female";
    const name = ritem(NAMES[sex]);
    const genome = [];

    for (const trait of first.genome) {
        // TODO: replace with a better lookup solution
        let matching: Trait | null = null;
        for (const other of second.genome) {
            if (other.gene == trait.gene) {
                matching = other;
            }
        }
        if (matching == null) {
            continue;
        }

        const ctrait = mix_traits(trait, matching);
        if (ctrait == null) {
            continue;
        }

        genome.push(ctrait);
    }

    return { sex: sex, name: name, genome: genome, outside: false };
}

/**
 * Generates a pair of people that can produce children.
 * 
 * @returns A Breeding Pair of people/
 */
export function random_pair(): [Person, Person] {
    const foutside = rbool();
    return [random_person("male", foutside), random_person("female", !foutside)];
}

/**
 * Generate a random Person.
 * 
 * @returns A randomly generated person.
 */
export function random_person(desired_sex?: Sex, is_outside?: boolean): Person {
    const sex = desired_sex == undefined ? random_sex() : desired_sex;
    const name = random_name(sex);
    const genome = random_genome();
    const outside = is_outside == undefined ? false : is_outside;

    return { sex: sex, name: name, genome: genome, outside: outside };
}

/**
 * Generates a random Sex.
 * 
 * @returns Random 50% chance.
 */
function random_sex(): Sex {
    return rbool() ? "male" : "female";
}

/**
 * Gets a popular name assigned at birth for the given sex.
 * 
 * @param sex The sex of the person.
 * @returns An traditional assigned-at-birth name.
 */
function random_name(sex: Sex): string {
    return ritem(NAMES[sex]);
}

/**
 * Generates a random Genome.
 * 
 * @returns A random Genome.
 */
function random_genome(): Genome {
    let traits: Trait[] = []

    for (const gene of GENES) {
        traits.push(random_trait(gene));
    }
    return traits;
}

/**
 * Generates a random Trait.
 * 
 * @param gene The Gene of the given Trait.
 * @returns A random Trait for the Gene.
 */
function random_trait(gene: Gene): Trait {
    return new Trait(gene, random_alleles());
}

/**
 * Generates a random single Allele.
 * 
 * @returns A random Allele.
 */
export function random_alleles(): AllelePair {
    const random_allele = () => rbool() ? Allele.BIG : Allele.SMALL;
    return [random_allele(), random_allele()];
}