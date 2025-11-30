"use client";

import { useState, useEffect } from "react";
import styles from "./FloatingCTA.module.css";

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 300;
            const contactSection = document.getElementById("contact");

            if (contactSection) {
                const contactRect = contactSection.getBoundingClientRect();
                const isContactVisible = contactRect.top < window.innerHeight && contactRect.bottom > 0;

                // Show button if scrolled down AND contact section is not visible
                setIsVisible(scrolled && !isContactVisible);
            } else {
                setIsVisible(scrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Check on mount

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToContact = () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <button
            className={`${styles.floatingButton} ${isVisible ? styles.visible : ""}`}
            onClick={scrollToContact}
            aria-label="お問い合わせ"
        >
            お問い合わせ
        </button>
    );
}
