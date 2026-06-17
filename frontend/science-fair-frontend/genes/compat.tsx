import { get_phenotype } from './genes';
import { Sex, Person } from './person';
import { Tree, TreeNode, Couple, TreeViewer } from './tree';

export type ExtNode = {
    id: number;
    pids?: number[];
    mid?: number;
    fid?: number;
    name: string;
    gender: Sex;
    pheno: string;
    alleles: string;
}


type CoupleContext = {
    mid: number;
    fid: number;
}

class ExtCollectorTreeVisitor extends TreeViewer {
    private context: CoupleContext[];
    private encountered: number;
    public ext_nodes: ExtNode[];

    constructor() {
        super();
        this.context = [];
        this.ext_nodes = [];
        this.encountered = 0;
    }

    visit(node: TreeNode): void {
        if ("children" in node) {
            this.view_couple(node);
            for (const child of node.children) {
                this.visit(child);
            }
            this.context.pop();
        } else {
            this.view_person(node);
        }
    }


    view_couple(node: Couple) {
        let first = this.derive_ext(node.first);
        let second = this.derive_ext(node.second);

        first.pids = [second.id];
        second.pids = [first.id];

        this.context.push({ mid: first.id, fid: second.id });
        this.ext_nodes.push(first);
        this.ext_nodes.push(second);
    }

    view_person(node: Person) {
        this.ext_nodes.push(this.derive_ext(node));
    }

    /**
     * Derive an External Node definition from a node in our root tree.
     * 
     * @param node The node from which to derive an extenal definition.
     * @param is_root Wether or not this is a root node and some fields should be omitted.
     * @returns A new ExtNode with the given information.
     */
    derive_ext(node: Person): ExtNode {
        const context = this.context.at(-1);
        const is_root = context == undefined;

        // assign a placeholder fid and mid if not defined
        const id = ++this.encountered;

        // TODO: add support for full genome
        const trait = node.genome[0];
        const alleles = trait.fmt_alleles();
        const phenotype = get_phenotype(trait.gene, trait.get_dominance());

        const base_node = {
            id: id,
            name: node.name,
            gender: node.sex,
            alleles: alleles,
            pheno: phenotype,
        }

        // if we're handling a root node OR we're handling a non-family node:
        // don't include the fid & mid fields
        if (is_root || node.outside) {
            return base_node;
        }

        // otherwise, deal with a person node
        return {
            ...base_node,
            fid: context.fid,
            mid: context.mid,
        };
    }
}

export function translate_tree(tree: Tree): ExtNode[] {
    let visitor = new ExtCollectorTreeVisitor();
    visitor.visit(tree);

    return visitor.ext_nodes;
}