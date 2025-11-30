"use client";

import { useState } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        theme: "ご質問",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", theme: "ご質問", message: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Contact</h2>
                <p className={styles.description}>
                    お仕事のご相談、お見積もりなど、お気軽にお問い合わせください。
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.group}>
                        <label htmlFor="name">お名前</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="email">メールアドレス</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="theme">お問い合わせ種別</label>
                        <div className={styles.selectWrapper}>
                            <select
                                id="theme"
                                name="theme"
                                value={formData.theme}
                                onChange={handleChange}
                            >
                                <option value="ご質問">ご質問</option>
                                <option value="お見積もり依頼">お見積もり依頼</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="subject">件名</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="message">お問い合わせ内容</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" className={styles.button} disabled={status === "submitting"}>
                        {status === "submitting" ? "送信中..." : "送信する"}
                    </button>

                    {status === "success" && (
                        <p className={styles.successMessage}>お問い合わせを受け付けました。ありがとうございます。</p>
                    )}
                    {status === "error" && (
                        <p className={styles.errorMessage}>送信に失敗しました。時間をおいて再度お試しください。</p>
                    )}
                </form>
            </div>
        </section>
    );
}
