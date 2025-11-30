import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copy}>&copy; {new Date().getFullYear()} TRI-COMMA. All rights reserved.</p>
            </div>
        </footer>
    );
}
