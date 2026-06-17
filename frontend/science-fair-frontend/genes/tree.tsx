import { AllelePairDesc, Trait, desc_from_alleles } from './genes';
import { Person, generate_child, generate_children, random_pair, random_person } from './person';

export type Tree = RootNode;

/**
 * A Root Node; which must be a Couple.
 */
type RootNode = Couple;

/**
 * A Tree Node; either a branch node (Couple) or leaf node (Person).
 */
export type TreeNode = Couple | Person;

export class Couple {
    readonly first: Person;
    readonly second: Person;
    children: TreeNode[];

    constructor(first: Person, second: Person, children?: TreeNode[]) {
        this.first = first;
        this.second = second;
        this.children = children == undefined ? [] : children;
    }
}

/**
 * Visits a Tree.
 */
export abstract class TreeVisitor {
    abstract visit(node: TreeNode): void;
}

/**
 * TreeVisitor.
 */
export abstract class TreeViewer extends TreeVisitor {
    visit(node: TreeNode) {
        if ("children" in node) {
            this.view_couple(node);
            for (const child of node.children) {
                this.visit(child);
            }
        } else {
            this.view_person(node);
        }
    }

    abstract view_couple(node: Couple): void;
    abstract view_person(node: Person): void;
}

/**
 * TreeTransformer.
 */
export abstract class TreeTransformer extends TreeVisitor {
    depth: number;

    constructor() {
        super();
        this.depth = 0;
    }

    visit(node: TreeNode): TreeNode | null {
        if ("children" in node) {
            // increment depth tracker
            this.depth++;

            const nchildren = [];
            const mcouple = this.view_couple(node); // FIXME: use return value
            const couple = mcouple == null ? node : mcouple;

            if (!("children" in couple)) {
                return couple;
            }

            for (const child of couple.children) {
                const mval = this.visit(child);
                if (mval != null) {
                    nchildren.push(mval);
                } else {
                    nchildren.push(child);
                }
            }
            this.depth--;
            return new Couple(couple.first, couple.second, nchildren);
        } else {
            return this.view_person(node);
        }
    }

    abstract view_couple(node: Couple): TreeNode | null;
    abstract view_person(node: Person): TreeNode | null;
}

class DepthTreeViewer extends TreeVisitor {
    depth: number;
    max_depth: number;
    genotypes: Trait[];

    constructor() {
        super();
        this.depth = 0;
        this.max_depth = 0;
        this.genotypes = [];
    }

    visit(node: TreeNode): void {
        if ("children" in node) {
            this.descend(node);
            for (const child of node.children) {
                this.visit(child);
            }
            this.ascend();
        }
    }

    descend(couple: Couple) {
        if (couple.children.length == 0) {
            return;
        }

        this.depth++;
        if (this.depth > this.max_depth) {
            this.max_depth = this.depth;
        }
    }

    ascend() {
        this.depth--;
    }
}

class GenerationTransformer extends TreeTransformer {
    litter_size: number;
    operating_depth: number;

    constructor(litter_size: number, operating_depth: number) {
        super();
        this.litter_size = litter_size;
        this.operating_depth = operating_depth;
    }

    view_couple(node: Couple): TreeNode | null {
        return null;
    }

    view_person(node: Person): TreeNode | null {
        if (this.depth == this.operating_depth) {
            const sex = node.sex == "male" ? "female" : "male";
            const second = random_person(sex, true);

            const children = generate_children(node, second, this.litter_size);
            return new Couple(node, second, children);
        }
        return null;
    }
}

/**
 * Create a new Tree with a random Couple as its root node.
 * 
 * @returns A new default Tree.
 */
export function new_tree(): Tree {
    return new Couple(...random_pair());
}

/**
 * Create a new Generation of people. 
 * 
 * @param tree The Tree to modify.
 */
export function new_generation(tree: Tree, litter_size: number): Tree | null {
    // TODO: replace with more generic solution; this is ugly
    const is_new = ("children" in tree) && (tree.children.length == 0);
    if (is_new) {
        tree.children = generate_children(tree.first, tree.second, litter_size);
        return tree;
    }
    const dviewer = new DepthTreeViewer();
    dviewer.visit(tree);

    const depth = dviewer.max_depth;
    const cmaker = new GenerationTransformer(litter_size, depth);
    const childed_tree = cmaker.visit(tree);

    // @ts-expect-error
    return childed_tree;
}