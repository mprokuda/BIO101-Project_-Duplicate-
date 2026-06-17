import FamilyTree from '@balkangraph/familytree.js';
import styles from './Tree.module.css';
import React, { useState, useEffect } from 'react';
import { Tree } from '../genes/tree';
import { translate_tree } from '../genes/compat';

const NODE_BINDING = {
  field_0: "name",
  field_1: "alleles",
  img_0: "pheno",
}

const NODE_MENU = {
  details: { text: "View" },
}

const EDIT_FORM = {
  readOnly: true,
  buttons: {
    pdf: null,
    edit: null,
    share: null,
  }
}

const TEMPLATE_NAME = "genes";

export default function Tree({ tree }: { tree: Tree }) {
  const [treeDom, setTreeDom] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const treeDom = document.getElementById("tree");
    if (treeDom == null) {
      return;
    }

    // initialize DOM element and store for later init.
    treeDom.className = styles.tree;
    setTreeDom(treeDom);

    // setup custom template for FamilyTree
    set_genes_template();
  }, [treeDom]);

  if (treeDom != null) {
    const nodes = translate_tree(tree);
    generate_ftree(nodes, treeDom);
  }

  return (
    <></>
  );
}

function generate_ftree(nodes: any, domTree: HTMLElement): FamilyTree {
  return new FamilyTree(domTree, {
    template: TEMPLATE_NAME,
    scaleInitial: FamilyTree.match.boundary,
    orientation: FamilyTree.orientation.top,
    mouseScrool: FamilyTree.action.none,
    enableSearch: false,
    nodeBinding: NODE_BINDING,
    nodes: nodes,
    nodeMenu: NODE_MENU,
    editForm: EDIT_FORM,
  });
}

function set_genes_template() {
  const M_TMP = TEMPLATE_NAME + "_male";
  const F_TMP = TEMPLATE_NAME + "_female";

  // copy defaults for our custom template from the default template "john"
  FamilyTree.templates[TEMPLATE_NAME] = Object.assign({}, FamilyTree.templates.john);
  FamilyTree.templates[M_TMP] = Object.assign({}, FamilyTree.templates.john_male);
  FamilyTree.templates[F_TMP] = Object.assign({}, FamilyTree.templates.john_female);
}