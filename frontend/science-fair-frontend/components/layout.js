import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css';

export const siteTitle = 'Science Fair Time';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}></header>
      
      <div className={styles.introduction}>
        <h1 className={styles.title}> Mendelian Genetics </h1>

        <p className={styles.description}>
          Hello! This website allows you to simulate a number of generations of inheritance and generate a statistical analysis
          of the results. Give it a try :)
        </p>
        <div className={styles.instructions}>
          <h1>instructions</h1>
          <ul className={styles.uselist}>
            <li>Choose parent's genotypes</li>
            <li>Choose number of children (number of children each couple has)</li>
          </ul>
          <h1>Key</h1>
          <ul className={styles.uselist}>
            <li>Red nodes show the dominant phenotype (blue is recessive)</li>
            <li>Blue circles are male, red are female</li>
          </ul>
        </div>
      </div>

      <main className={styles.children}>{children}</main>
    </div>
  );
}