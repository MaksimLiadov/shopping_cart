import React from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Button } from 'primereact/button';
import styles from "./Navigator.module.css"

const Navigator = () => {
    const basketLength = useSelector((state) => state.basket.basketItems.length);
    return (
        <div className={styles.buttonsContainer}>
            <Link className={styles.NavLink} to="/catalog">
                <Button className={styles.NavButton} label="Каталог" />
            </Link>
            <Link className={styles.NavLink} to="/basket">
                <Button className={styles.NavButton} label={"Корзина" + "(" + basketLength + ")"} />
            </Link>
        </div>
    );
};

export default Navigator;
