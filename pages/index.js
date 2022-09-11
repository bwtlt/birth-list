import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/BirthList.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Liste de naissance</title>
        <meta name="description" content="La liste de naissance de Bébé Waka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.logo}></div>
            <div className={styles.title}>La liste de naissance de bébé Waka</div>
          </div>
          <div className={styles.body}>
            <div className={styles.intro}>
              <div className={styles.introText}>
                <p>Cela fait six mois que nous nous préparons à l’arrivée de notre petite fille. Vous vous projetez avec nous dans ce nouveau chapitre de notre vie et cela nous touche profondément. Vous nous demandez souvent ce qui nous ferait plaisir, ce dont nous aurions besoin ou comment nous aider à accueillir au mieux notre petit bout de chou dans notre maison roulante.</p>
                <p>Alors avec Bertrand nous avons listé nos envies ci-dessous, et on aimerait beaucoup que vous privilégiez dans la mesure du possible des produits de seconde main ou fait main : qu’ils proviennent de votre garage, de Vinted, du bon coin, de créateurs et autres ça nous ferait très plaisir.</p>
                <p>Pour les achats chez Autour De Bébé, nous avons une carte fidélité au nom de Laëtitia Watelet.</p>
              </div>
              <Image className={styles.introImage} src="/parents.jpg" height={500} width={500} alt="Les heureux parents"></Image>
            </div>
            <div className={styles.list}>
              <div className={styles.listTitle}>Liste prioritaire</div>
              <div className={styles.sublist}>
                <div className={styles.sublistTitle}>Les sorties</div>
                <div className={styles.item}>
                  <Image className={styles.itemImage} src="/joie_steadi.jpg" height={175} width={125} alt="Item image"></Image>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>Siège auto</div>
                    <div className={styles.itemDescription}>Steadi de Joie en couleur Rouge, sur le site internet 169€, en magasin 149€ en Septembre (disponible chez Bébé 9 et Aubert)</div>
                    <a href="#" className={styles.itemLink}>Lien</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}