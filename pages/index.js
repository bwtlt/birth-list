import { database } from '../firebase.config'
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Item from './components/Item'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext';

const dbInstance = collection(database, 'list-items');

export default function Home() {
  const [itemsArray, setItemsArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const { authUser, loading, signInWithEmailAndPassword } = useAuth();

  useEffect(() => {
    if (authUser) {
      getDocs(dbInstance)
        .then((data) => {
          setItemsArray(data.docs.map((item) => {
            const itemCategory = item.data().category
            if (categories.indexOf(itemCategory) === -1) {
              setCategories([...categories, itemCategory])
            }
            return { ...item.data(), id: item.id }
          }));
        })
    }
  }, [categories])

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
            <div className={styles.logo}>
              <Image src="/logo.svg" alt="Vercel Logo" width={40} height={40} />
            </div>
            <div className={styles.title}>La liste de naissance de bébé Waka</div>
          </div>
          <div className={styles.body}>
            {authUser === null ?
              <div className={styles.login}>
                <form onSubmit={async (e) => {
                  signInWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                  });
                }}>
                  <label htmlFor="email">Email :</label>
                  <input type="email" id="email" name="email" required/>
                  <label htmlFor="password">Mot de passe :</label>
                  <input type="password" id="password" name="password" required/>
                  <input type="submit" value="Sign in"/>
                </form>
              </div>
              : <><div className={styles.intro}>
                <div className={styles.introText}>
                  <p>Cela fait six mois que nous nous préparons à l’arrivée de notre petite fille. Vous vous projetez avec nous dans ce nouveau chapitre de notre vie et cela nous touche profondément. Vous nous demandez souvent ce qui nous ferait plaisir, ce dont nous aurions besoin ou comment nous aider à accueillir au mieux notre petit bout de chou dans notre maison roulante.</p>
                  <p>Alors avec Bertrand nous avons listé nos envies ci-dessous, et on aimerait beaucoup que vous privilégiez dans la mesure du possible des produits de seconde main ou fait main : qu’ils proviennent de votre garage, de Vinted, du bon coin, de créateurs et autres ça nous ferait très plaisir.</p>
                  <p>Pour les achats chez Autour De Bébé, nous avons une carte fidélité au nom de Laëtitia Watelet.</p>
                </div>
                <Image className={styles.introImage} src="/parents.jpg" height={500} width={500} alt="Les heureux parents"></Image>
              </div>
                <div className={styles.list}>
                  <div className={styles.listTitle}>Liste prioritaire</div>
                  {itemsArray.map((item) => {
                    return (<Item key={item.id} item={item} database={database} />)
                  })}
                </div>
              </>
            }
          </div>
        </div>
      </main>
    </div>
  )
}