import React from 'react'
import styles from '../styles/Maintenance.module.scss'
import Image from 'next/image'

export default function Maintenance () {
  return (
    <main>
      <div className={styles.body}>
        <div id="article">
          <div className={styles.title}>La liste de naissance revient vite !</div>
          <div className={styles.content}>
          <div className={styles.introImageContainer}>
            <Image className={styles.introImage} src="/maintenance.jpg" layout="fill" objectFit="contain" alt="Les parents perdus"></Image>
          </div>
          <div>
            <p>Nous sommes désolés pour le désagrément, nous sommes en train d&apos;effectuer une maintenance.</p>
            <p>— Laëtitia et Bertrand</p>
          </div>
          </div>
        </div>
      </div>
    </main>
  )
}
