import { Couple, new_generation, new_tree } from '../genes/tree';
import { find_stats } from '../genes/stats';
import Head from 'next/head';
import styles from '../styles/main.module.css';
import Layout, { siteTitle } from '../components/layout';
import { useEffect, useState } from 'react';
import { SimTypes } from '../components/SimTypes';
import { ChildNumber } from '../components/ChildNumber';
import Tree from '../components/Tree';
import { GenomeSelection, GenomeSelector, selection_to_alleles } from '../components/GenomeSelector';
import { Person, Sex, random_person } from '../genes/person';
import { Trait } from '../genes/genes';

const NUM_GENERATIONS = 3;

type GenState = {
  first_parent: GenomeSelection,
  second_parent: GenomeSelection,
  generations: number,
  num_children: number,
}

enum ParentId {
  FIRST,
  SECOND,
}

export default function Main(props: any) {
  const [tree, setTree] = useState(new_tree());
  const [genState, setGenState] = useState<GenState>(new_genstate());

  const handleChild = (num_children: number) => {
    setGenState({
      ...genState,
      num_children: num_children,
    });
  }

  const handleSelection = (selection: GenomeSelection, parent_id: ParentId) => {
    const copied = { ...genState };
    const field = parent_id == ParentId.FIRST ? "first_parent" : "second_parent";

    copied[field] = selection;
    setGenState(copied);
  }

  useEffect(() => {
    const first = gen_root_parent("male", genState.first_parent);
    const second = gen_root_parent("female", genState.second_parent);

    let sometree = new Couple(first, second);
    for (let i = 0; i < genState.generations; i++) {
      // @ts-expect-error
      sometree = new_generation(sometree, genState.num_children);
    }

    setTree(sometree);
    console.log(find_stats(sometree));
  }, [genState]);


  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <div className={styles["side-bar-container"]}>
        <div className={styles["side-bar-subcontainer"]}>
          <GenomeSelector parent_id={ParentId.FIRST} onChange={handleSelection} />
          <GenomeSelector parent_id={ParentId.SECOND} onChange={handleSelection} />
        </div>
        <div className={styles["side-bar-subcontainer"]}>
          <h1 className={styles["container-header"]}> Number Of Children </h1>
          <ChildNumber onChange={handleChild} />
        </div>
      </div>

      <div className={styles["main-content"]}>
        <div id="tree"></div>
        <Tree tree={tree} />
      </div>
    </Layout>
  )
}

function new_genstate(): GenState {
  return {
    first_parent: "random",
    second_parent: "random",
    generations: NUM_GENERATIONS,
    num_children: 1.
  };
}

function gen_root_parent(sex: Sex, selection: GenomeSelection): Person {
  let person = random_person(sex);
  const alleles = selection_to_alleles(selection);

  // modify the alleles in the traits of a person's genome to match our desired value
  let modified_traits = [];
  for (let trait of person.genome) {
    modified_traits.push(new Trait(trait.gene, alleles));
  }

  person.genome = modified_traits;
  return person;
}