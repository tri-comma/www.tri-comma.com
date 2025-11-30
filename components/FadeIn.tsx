"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FadeIn.module.css";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: "0px 0px -50px 0px", // Offset trigger slightly
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.fadeIn} ${isVisible ? styles.visible : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
