import { AllelePairDesc, Trait, desc_from_alleles } from "./genes";
import { Person } from "./person";
import { Couple, Tree, TreeNode, TreeVisitor } from "./tree";

export type Statistics = {
    heterozygous: number;
    homozygous_rec: number;
    homozygous_dom: number;
}

class StatTreeViewer extends TreeVisitor {
    genotypes: Trait[];
    seen: Record<AllelePairDesc, number>;

    constructor() {
        super();
        this.genotypes = [];
        this.seen = {
            "heterozygous": 0,
            "homozygous_dominant": 0,
            "homozygous_recessive": 0,
        }
    }


    visit(node: TreeNode): void {
        if ("children" in node) {
            this.view_couple(node);
            for (const child of node.children) {
                this.visit(child);
            }
        }else{
            this.view_person(node);
        }
    }

    view_couple(node: Couple): TreeNode | null {
        this.view_person(node.first);
        this.view_person(node.second);
        return null;
    }

    view_person(node: Person): TreeNode | null {
        const trait = node.genome[0];
        const description = desc_from_alleles(trait.alleles);

        this.seen[description]++;
        return null;
    }
}

export function find_stats(tree: Tree): Statistics{
    const statviewer = new StatTreeViewer();
    statviewer.visit(tree);

    const heterozygous = statviewer.seen.heterozygous;
    const homozygous_dom = statviewer.seen.homozygous_dominant;
    const homozygous_rec = statviewer.seen.homozygous_recessive;

    return {heterozygous, homozygous_dom, homozygous_rec};
}