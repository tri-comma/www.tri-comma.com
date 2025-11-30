import styles from "./Hero.module.css";
import FadeIn from "./FadeIn";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.parallaxBg}></div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <FadeIn>
                    <h1 className={styles.title}>
                        Enterprise Quality,
                        <br />
                        Personal Agility.
                    </h1>
                </FadeIn>
                <FadeIn delay={200}>
                    <p className={styles.subtitle}>
                        確かな技術と柔軟な発想で、
                        <br />
                        ビジネスの「次」を創る。
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
