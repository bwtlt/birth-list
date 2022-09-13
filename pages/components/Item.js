import Image from 'next/image'
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import styles from '../../styles/BirthList.module.scss'

export default function Item(props) {
    const item = props.item;
    const [showNameField, setShowNameField] = useState(false);
    const [giftedBy, setGiftedBy] = useState(item.giftedBy);
    let component;
    if (giftedBy) {
        component = <div className={styles.gifted}>Déjà offert</div>;
    } else if (showNameField) {
        component = <form className={styles.gifterForm} onSubmit={async (e) => {
            e.preventDefault();
            const name = document.querySelector('#name').value

            if (!name) {
                alert("Merci d'entrer votre nom")
                return false
            } else {
                const itemRef = doc(props.database, "list-items", item.id);
                await updateDoc(itemRef, {
                    giftedBy: name
                })
                setGiftedBy(name)
            }
            setShowNameField(false);
        }}>
            <div className={styles.gifterFormFields}>
                <input type="text" name="name" id="name" placeholder="Votre nom"/>
                <button className={styles.gifterFormButton} type="submit">Ok</button>
                <button className={styles.gifterFormButton} onClick={() => {setShowNameField(false)}}>Annuler</button>
            </div>
        </form>
    } else {
        component = <button className={styles.giftButton} role="button" onClick={
            () => { setShowNameField(true) }
        }>J'offre ce cadeau</button>;
    }
    return (
        <>
            <div className={styles.item}>
                <div className={styles.itemImageContainer}>
                    {item.image && <Image className={styles.itemImage} src={item.image} layout="fill" objectFit="contain" alt="Item image"></Image>}
                </div>
                <div className={styles.itemInfo}>
                    <div className={styles.itemSpecs}>
                        <div className={styles.itemName}>{item.name}</div>
                        {item.description && <div className={styles.itemDescription}>{item.description}</div>}
                        {item.price && <div className={styles.itemPrice}>{item.price}€</div>}
                        {item.link && <a href={item.link} className={styles.itemLink}>Lien</a>}
                    </div>
                    {component}
                </div>
            </div>
        </>
    )
}