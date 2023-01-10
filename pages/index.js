import React, { useState, useEffect } from 'react'
import firebase from '../lib/firebase'
import 'firebase/firestore'
import Head from 'next/head'
import Image from 'next/image'
import Item from './components/Item'
import Script from 'next/script'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext'

const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL
const db = firebase.firestore()
const CATEGORIES = ['Les repas', 'Les sorties', 'La chambre', 'La toilette', 'Les vêtements', "L'éveil", 'Les souvenirs', 'Les parents']

export default function Home () {
  const [category, setCategory] = useState('Tout')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { authUser, signInWithEmailAndPassword } = useAuth()
  const [items, setItems] = useState([])
  const [giftedItems, setGiftedItems] = useState([])
  const [loadedDb, setLoadedDb] = useState(false)

  useEffect(() => {
    if (authUser && !loadedDb) {
      setLoading(true)
      setGiftedItems([])
      setItems([])
      db.collection('list-items').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data()
          item.id = doc.id
          if (item.giftedBy && !item?.number) {
            setGiftedItems(giftedItems => [...giftedItems, item])
          } else {
            setItems(items => [...items, item])
          }
        })
      })
      setLoading(false)
      console.log('Items retrieved succesfully')
      setLoadedDb(true)
    }
  }, [authUser, loadedDb])

  const filterItem = (item) => {
    const categoryMatches = category === 'Tout' || item.category === category
    return !item.hidden && categoryMatches
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Liste de naissance</title>
        <meta name="description" content="La liste de naissance de Romy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Script src="https://kit.fontawesome.com/c9688da9a5.js" crossorigin="anonymous"></Script>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </div>
          <div className={styles.title}>La liste de naissance de Romy</div>
        </div>
        <div className={styles.body}>
          {loading && <div>Chargement en cours...</div>}
          {!loading && authUser === null &&
            <form className={styles.login} onSubmit={async (e) => {
              setLoading(true)
              signInWithEmailAndPassword(email, password)
                .then(() => {
                  console.log('Log in succesful')
                })
                .catch((error) => {
                  console.error(error)
                })
              e.preventDefault()
            }}>
              <label htmlFor="password">Mot de passe : </label>
              <input className={styles.passwordField} type="password" id="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
              <input type="submit" value="Entrer" className={styles.gifterFormButton} />
            </form>
          }
          {authUser &&
            <>
              <div className={styles.intro}>
                <div className={styles.introText}>
                  <p>
                  Notre petite fille est née le Mardi 20 Décembre 2022 à 20h58 à Saint-Etienne.<br/>
                  Elle s&apos;appelle Romy Anouch Watelet et elle rend déjà gaga toute la famille.<br/>
                  Bien gâtée, il nous manque très peu de chose...<br/>
                  Un compte bancaire lui a été ouvert pour les futurs achats.<br/>
                  Sinon, voici quelques articles qui nous feraient très plaisir et que nous aurions besoin d&apos;avoir au quotidien.<br/>
                  La liste n&apos;est pas exhaustive, si vous souhaitez nous offrir d&apos;autres présents, cela nous touchera beaucoup.<br/>
                  Sachez qu&apos;on apprécie les cadeaux de seconde main, d&apos;occasion, faits main...
                  </p>

                  <p>
                    <span className={styles.question}>Comment ça marche ?</span>
                    <br></br>
                    C&apos;est super simple, tu te positionnes sur un article à offrir, tu cliques sur &quot;j&apos;offre ce cadeau&quot; en indiquant ton prénom pour valider.
                    Ensuite, à toi de te rendre en magasin ou sur internet pour acheter l&apos;article.
                  </p>
                  <p>
                    La plupart des liens que nous avons mis proviennent du magasin Autour de bébé où nous avons une carte fidélité au nom de &quot;Laëtitia Watelet&quot;, n&apos;hésite pas à l&apos;utiliser.
                    Cependant si c&apos;est plus pratique pour toi ces articles sont surement disponibles chez Aubert, Bébé9, etc.
                  </p>

                  <p>
                    <span className={styles.question}>J&apos;ai fait une erreur d&apos;article ou de manipulation, je souhaite changer d&apos;article... comment faire ?</span>
                    <br></br>
                    Envoie nous un message, on annulera le problème.
                  </p>

                  <p>On te laisse découvrir tout ça, à bientôt pour la rencontrer !</p>
                </div>
                <div className={styles.introImageContainer}>
                  <Image className={styles.introImage} src="/parents.png" layout="fill" objectFit="contain" alt="Les heureux parents"></Image>
                </div>
              </div>
              <form action="#" className={styles.filterControls}>
                <label>Filtres : </label>
                <select className={styles.select} name="category" id="categorySelect" value={category} onChange={(e) => {
                  setCategory(e.target.value)
                }}>
                  <option value="Tout">Catégorie...</option>
                  {CATEGORIES.map((cat) => {
                    return (<option value={cat} key={cat}>{cat}</option>)
                  })}
                </select>
                <button className={styles.filterButton} onClick={(e) => {
                  e.preventDefault()
                  setCategory('Tout')
                }}>Réinitialiser</button>
              </form>

              <div className={styles.sublistTitle}>Catégorie : {category}</div>
              <>
                <div className={styles.list}>
                  {items.filter((item) => filterItem(item)).map((item) => {
                    return (<Item key={item.id} item={item} database={db} />)
                  })}
                </div>
              </>
              <>
                <div className={styles.listTitle}>Déjà offerts</div>
                <div className={styles.list}>
                  {giftedItems.filter((item) => filterItem(item)).map((item) => {
                    return (<Item key={item.id} item={item} database={db} />)
                  })}
                </div>
              </>

            </>
          }
        </div>
        <div className={styles.footer}>Site créé par L&B</div>
      </main>
    </div>
  )
}
