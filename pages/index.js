import firebase from "../lib/firebase";
import "firebase/firestore";
import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Item from './components/Item'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext';

const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL;
const db = firebase.firestore();
const CATEGORIES = ["Les repas", "Les sorties", "La chambre", "La toilette", "L'éveil", "Les souvenirs", "Les parents"];
const PRIORITIES = [
  "« Prioritaire », nécessaire avant la naissance.",
  "« Les petits essentielles », peut attendre après la naissance.",
  "« Les petits plus »",
];
const Priorities = {
  All: -1,
  High: 0,
  Low: 1,
  Sub: 2,
}

export default function Home() {
  const [category, setCategory] = useState("Tout");
  const [priority, setPriority] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { authUser, signInWithEmailAndPassword } = useAuth();
  const [highPriorityItems, setHighPriorityItems] = useState([]);
  const [lowPriorityItems, setLowPriorityItems] = useState([]);
  const [subPriorityItems, setSubPriorityItems] = useState([]);
  const [giftedItems, setGiftedItems] = useState([]);

  useEffect(() => {
    if (authUser) {
      setLoading(true);
      db.collection("list-items").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          if (item.giftedBy) {
            setGiftedItems(giftedItems => [...giftedItems, item]);
          } else if (item.priority == Priorities.High) {
            setHighPriorityItems(highPriorityItems => [...highPriorityItems, item]);
          } else if (item.priority == Priorities.Low) {
            setLowPriorityItems(lowPriorityItems => [...lowPriorityItems, item]);
          } else {
            setSubPriorityItems(subPriorityItems => [...subPriorityItems, item]);
          }
        });
      });
      setLoading(false);
    }
  }, [authUser])

  const filterItem = (item) => {
    const categoryMatches = category == "Tout" || item.category == category;
    return !item.hidden && categoryMatches;
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Liste de naissance</title>
        <meta name="description" content="La liste de naissance de Bébé Waka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="Vercel Logo" width={40} height={40} />
          </div>
          <div className={styles.title}>La liste de naissance de bébé Waka</div>
        </div>
        <div className={styles.body}>
          {loading && <div>Chargement en cours...</div>}
          {!loading && authUser === null &&
            <form className={styles.login} onSubmit={async (e) => {
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
              <input className={styles.passwordField} type="password" id="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
              <input type="submit" value="Entrer" className={styles.gifterFormButton}/>
            </form>
          }
          {authUser &&
            <>
              <div className={styles.intro}>
                <div className={styles.introText}>
                  <p>
                    Cela fait sept mois que nous préparons l’arrivée de notre petite fille.
                    Tu te projètes avec nous dans ce nouveau chapitre de notre vie et cela nous touche profondément.
                    On nous demande souvent ce qui nous ferait plaisir et ce dont nous aurions besoin pour accueillir au mieux notre petit bout de chou dans notre maison roulante.
                  </p>

                  <p>Alors Tadam !! voilà THE List ! En réalité il y en a deux :  une avec les articles dont nous aurions besoin avant sa naissance et l&apos;autre qui peut attendre sa venue au monde. </p>

                  <p>
                    <span className={styles.question}>Comment ça marche ?</span>
                    <br></br>
                    C&apos;est super simple, tu te positionnes sur un article à offrir, tu cliques sur &quot;j&apos;offre ce cadeau&quot; en indiquant ton prénom pour valider.
                    Ensuite, à toi de te rendre en magasin ou sur internet pour acheter l&apos;article.
                    Il peut aussi provenir de ton garage, de Vinted ou du fait main, ce qui nous ferait très plaisir !
                    Pas besoin de paquet cadeau, bon si, j&apos;avoue : un petit noeud rose c&apos;est toujours la classe.
                    Et le tour est joué !
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

                  <p>On te laisse découvrir tout ça, à bientôt et merci !</p>
                </div>
                <div className={styles.introImageContainer}>
                  <Image className={styles.introImage} src="/parents.png" layout="fill" objectFit="contain" alt="Les heureux parents"></Image>
                </div>
              </div>
              <form action="#" className={styles.filterControls}>
                <label>Filtres : </label>
                <select className={styles.select} name="category" id="category" value={category} onChange={(e) => {
                  setCategory(e.target.value);
                }}>
                  <option value="Tout">Catégorie...</option>
                  {CATEGORIES.map((cat) => {
                    return (<option value={cat} key={cat}>{cat}</option>)
                  })}
                </select>
                <select className={styles.select} name="priority" id="priority" value={priority} onChange={(e) => {
                  setPriority(e.target.value);
                  ;
                }}>
                  <option value={Priorities.All}>Priorité...</option>
                  <option value={Priorities.High}>Prioritaire</option>
                  <option value={Priorities.Low}>Secondaire</option>
                  <option value={Priorities.Sub}>Les petits plus</option>
                </select>
                <button className={styles.filterButton} onClick={(e) => {
                  e.preventDefault();
                  setPriority(-1);
                  setCategory("Tout");
                }}>Réinitialiser</button>
              </form>

              <div className={styles.sublistTitle}>Categorie : {category}</div>
              {(priority == Priorities.All || priority == Priorities.High) &&
                <>
                  <div className={styles.listTitle}>Liste {PRIORITIES[Priorities.High]}</div>
                  <div className={styles.list}>
                    {highPriorityItems.filter((item) => filterItem(item)).map((item) => {
                      return (<Item key={item.id} item={item} database={db} />)
                    })}
                  </div>
                </>
              }
              {(priority == Priorities.All || priority == Priorities.Low) &&
                <>
                  <div className={styles.listTitle}>Liste {PRIORITIES[Priorities.Low]}</div>
                  <div className={styles.list}>
                    {lowPriorityItems.filter((item) => filterItem(item)).map((item) => {
                      return (<Item key={item.id} item={item} database={db} />)
                    })}
                  </div>
                </>
              }
              {(priority == Priorities.All || priority == Priorities.Sub) &&
                <>
                  <div className={styles.listTitle}>Liste {PRIORITIES[Priorities.Sub]}</div>
                  <div className={styles.list}>
                    {subPriorityItems.filter((item) => filterItem(item)).map((item) => {
                      return (<Item key={item.id} item={item} database={db} />)
                    })}
                  </div>
                </>
              }
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