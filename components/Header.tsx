"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "AI Demo", href: "#demo" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    TRI-COMMA
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={styles.navLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <button className={styles.menuButton} onClick={toggleMenu} aria-label="Menu">
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>
            </div>
        </header>
    );
}
