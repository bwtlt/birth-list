import Image from 'next/image'
import { useState } from 'react';
import styles from '../../styles/BirthList.module.scss'

export default function Item(props) {
    const item = props.item;
    const [showNameField, setShowNameField] = useState(false);
    const [showAddressField, setShowAddressField] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [giftedBy, setGiftedBy] = useState(item?.giftedBy);
    const [participants, setParticipants] = useState(item?.participants ? item?.participants : []);
    let component;
    let image = "/items/dejaoffert.jpeg";

    if (item?.image) {
        image = "/items" + item?.image;
    }

    if (giftedBy) {
        component = <div className={styles.giftedContainer}>
            <div className={styles.gifter}>
                Merci à {giftedBy} !
            </div>
            <div className={styles.gifted}>Déjà offert</div>
        </div>
    } else if (showNameField || showAddressField) {
        component = <form className={styles.gifterForm} onSubmit={async (e) => {
            e.preventDefault();

            setShowNameField(false);
            setShowAddressField(false);

            if (!name && !address) {
                alert("Merci d'entrer votre nom/adresse")
                return false
            } else {
                let updater = {};
                if (showNameField && name) {
                    setGiftedBy(name)
                    updater = {
                        giftedBy: name
                    };
                } else if (showAddressField && address) {
                    setParticipants([...participants, address]);
                    updater = {
                        participants: [...participants, address],
                    };
                }
                const itemRef = props.database.collection("list-items").doc(item?.id);
                return itemRef.update(updater)
                    .then(() => {
                        console.log("Document successfully updated!");
                        if (showAddressField)
                            alert("Merci pour votre participation !")
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            }
        }}>
            <input className={styles.formField} type="text" name="name" id="name" placeholder={showNameField ? "Votre nom" : "Votre adresse mail"} onChange={
                (e) => {
                    if (showNameField)
                        setName(e.target.value);
                    else if (showAddressField)
                        setAddress(e.target.value);
                }
            } />
            <div className={styles.gifterFormButtons}>
                <button className={styles.gifterFormButton} type="submit">Ok</button>
                <button className={styles.gifterFormButton} onClick={() => { setShowNameField(false); setShowAddressField(false); }}>Annuler</button>
            </div>
        </form>
    } else {
        component = <div className={styles.giftingButtons}>
            <button className={styles.giftButton} role="button" onClick={
                () => { setShowNameField(true) }
            }>J&apos;offre ce cadeau</button>
            {item?.share &&
                <button className={styles.giftButton} role="button" onClick={
                    () => { setShowAddressField(true) }
                }>Je participe à ce cadeau</button>
            }
        </div>;
    }

    return (
        <>
            <div className={styles.item}>
                <div className={styles.itemImageContainer}>
                    <Image className={giftedBy ? styles.giftedItemImage : styles.itemImage} src={image} layout="fill" objectFit="contain" alt="Item image"></Image>
                </div>
                <div className={styles.itemInfo}>
                    <div className={styles.itemSpecs}>
                        <div className={styles.itemName}>{item?.name}</div>
                        {item?.description &&
                            <div className={styles.itemDescription}>
                                {item?.description.replaceAll("\\n", "\n")}
                                {item?.share && <p>Possibilité de participer en groupe à ce cadeau. Inscris ton adresse mail pour que nous te mettions en lien avec les autres personnes qui souhaitent aussi y participer.</p>}
                            </div>}
                        {(!giftedBy && item?.price) && <div className={styles.itemPrice}>{item?.price}€</div>}
                        {item?.link && <a href={item?.link} className={styles.itemLink}>Lien</a>}
                    </div>
                    {component}
                </div>
            </div>
        </>
    )
}