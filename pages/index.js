import firebase from "../lib/firebase";
import "firebase/firestore";
import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Item from './components/Item'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext';

const db = firebase.firestore();
const CATEGORIES = ["Les repas", "Les sorties", "La chambre", "La toilette", "L'éveil", "Les souvenirs"];
const PRIORITIES = ["« Prioritaire », nécessaire avant la naissance.", "« Les petits essentielles », peut attendre après la naissance."];

export default function Home() {
  const [itemsArray, setItemsArray] = useState([]);
  const [category, setCategory] = useState("Tout");
  const [priority, setPriority] = useState(-1);
  const [loading, setLoading] = useState(false);
  const { authUser, signInWithEmailAndPassword } = useAuth();
  const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL;
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authUser) {
      setLoading(true);
      db.collection("list-items").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          setItemsArray(itemsArray => [...itemsArray, item]);
        });
      });
      setLoading(false);
    }
  }, [authUser])

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
            {loading && <div>Chargement en cours...</div>}
            {!loading && authUser === null &&
              <div className={styles.login}>
                <form onSubmit={async (e) => {
                  setLoading(true);
                  signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                      console.log("Log in succesful")
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                  e.preventDefault();
                }}>
                  <label htmlFor="password">Mot de passe : </label>
                  <input type="password" id="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
                  <input type="submit" value="Entrer" />
                </form>
              </div>
            }
            {authUser &&
              <>
                <div className={styles.intro}>
                  <div className={styles.introText}>
                    <p>Cela fait six mois que nous nous préparons à l’arrivée de notre petite fille. Vous vous projetez avec nous dans ce nouveau chapitre de notre vie et cela nous touche profondément. Vous nous demandez souvent ce qui nous ferait plaisir, ce dont nous aurions besoin ou comment nous aider à accueillir au mieux notre petit bout de chou dans notre maison roulante.</p>
                    <p>Alors avec Bertrand nous avons listé nos envies ci-dessous, et on aimerait beaucoup que vous privilégiez dans la mesure du possible des produits de seconde main ou fait main : qu’ils proviennent de votre garage, de Vinted, du bon coin, de créateurs et autres ça nous ferait très plaisir.</p>
                    <p>Pour les achats chez Autour De Bébé, nous avons une carte fidélité au nom de Laëtitia Watelet.</p>
                  </div>
                  <Image className={styles.introImage} src="/parents.jpg" height={500} width={500} alt="Les heureux parents"></Image>
                </div>
                <form action="#" className={styles.filterControls}>
                  <label>Filtres : </label>
                  <select className={styles.select} name="category" id="category" value={category} onChange={(e) => {
                    setCategory(e.target.value);
                  }}>
                    <option value="Tout">Sélectionner une catégorie...</option>
                    {CATEGORIES.map((cat) => {
                      return(<option value={cat} key={cat}>{cat}</option>)
                      })}
                  </select>
                  <select className={styles.select} name="priority" id="priority" value={priority} onChange={(e) => {
                    setPriority(e.target.value);
                  }}>
                    <option value={-1}>Sélectionner une priorité...</option>
                    <option value={0}>Prioritaire</option>
                    <option value={1}>Secondaire</option>
                  </select>
                  <button className={styles.filterButton} onClick={(e) => {
                    e.preventDefault();
                    setPriority(-1);
                    setCategory("Tout");
                  }}>Réinitialiser</button>
                </form>

                {priority >= 0 && <div className={styles.listTitle}>Liste {PRIORITIES[priority]}</div>}
                <div className={styles.sublistTitle}>Categorie : {category}</div>

                <div className={styles.list}>
                  {itemsArray.filter((item) => {
                    const hasPriority = priority == -1 || item.priority == priority;
                    const hasCategory = category == "Tout" || item.category == category;
                    return hasPriority && hasCategory;
                  }).map((item) => {
                    return (<Item key={item.id} item={item} database={db} />)
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