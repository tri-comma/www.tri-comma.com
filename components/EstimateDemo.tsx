"use client";

import { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import styles from "./EstimateDemo.module.css";
import FadeIn from "./FadeIn";

interface EstimateResult {
    projectType: string;
    requestDetails: {
        item: string;
        description: string;
        quantity: string;
        deadline: string;
    };
    estimate: {
        breakdown: Array<{
            category: string;
            items: Array<{
                name: string;
                unitPrice: number;
                quantity: number;
                amount: number;
            }>;
        }>;
        subtotal: number;
        tax: number;
        total: number;
        validityPeriod: string;
        notes: string[];
    };
    pastEstimates: Array<{
        date: string;
        description: string;
        quantity: string;
        unitPrice: number;
        total: number;
    }>;
    analysis: {
        currentUnitPrice: number;
        priceConsistency: string;
        profitMargin: string;
        profitComment: string;
    };
    suggestions: string[];
}

export default function EstimateDemo() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<EstimateResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSample, setLoadingSample] = useState(false);
    const [error, setError] = useState("");
    const [remainingUses, setRemainingUses] = useState(5);
    const { executeRecaptcha } = useGoogleReCaptcha();

    // localStorageから回数制限を読み込み、日付チェック
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('estimateDemo_lastDate');
        const storedRemaining = localStorage.getItem('estimateDemo_remaining');

        if (storedDate === today && storedRemaining) {
            setRemainingUses(parseInt(storedRemaining, 10));
        } else {
            // 日付が変わっているか、初回アクセス
            localStorage.setItem('estimateDemo_lastDate', today);
            localStorage.setItem('estimateDemo_remaining', '5');
            setRemainingUses(5);
        }
    }, []);

    // 回数を減らしてlocalStorageに保存
    const decrementRemainingUses = () => {
        const newRemaining = remainingUses - 1;
        setRemainingUses(newRemaining);
        localStorage.setItem('estimateDemo_remaining', newRemaining.toString());
    };

    const handleGenerateSample = async () => {
        if (remainingUses <= 0) {
            alert("本日の利用回数を超えました");
            return;
        }

        setLoadingSample(true);
        setError("");

        try {
            // Generate reCAPTCHA token
            let recaptchaToken = null;
            if (executeRecaptcha && typeof executeRecaptcha === 'function') {
                try {
                    recaptchaToken = await executeRecaptcha("demo_generate_sample");
                } catch (recaptchaError) {
                    console.warn("reCAPTCHA failed, continuing without it:", recaptchaError);
                }
            }

            const response = await fetch("/api/demo/generate-sample", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recaptchaToken }),
            });

            if (!response.ok) {
                throw new Error("サンプル生成に失敗しました");
            }

            const data = await response.json();
            setInput(data.sampleText);
            decrementRemainingUses();
        } catch (error) {
            setError("サンプル生成に失敗しました。もう一度お試しください。");
        } finally {
            setLoadingSample(false);
        }
    };

    const handleGenerate = async () => {
        if (!input.trim()) {
            alert("見積もり条件を入力してください");
            return;
        }

        if (remainingUses <= 0) {
            alert("本日の利用回数を超えました");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Generate reCAPTCHA token
            let recaptchaToken = null;
            if (executeRecaptcha && typeof executeRecaptcha === 'function') {
                try {
                    recaptchaToken = await executeRecaptcha("demo_estimate");
                } catch (recaptchaError) {
                    console.warn("reCAPTCHA failed, continuing without it:", recaptchaError);
                }
            }

            const response = await fetch("/api/demo/estimate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input,
                    recaptchaToken
                }),
            });

            if (!response.ok) {
                throw new Error("見積もり生成に失敗しました");
            }

            const data = await response.json();
            setResult(data);
            decrementRemainingUses();
        } catch (error) {
            setError("エラーが発生しました。もう一度お試しください。");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ja-JP');
    };

    return (
        <section id="demo" className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <h2 className={styles.heading}>AI DEMO</h2>
                    <p className={styles.description}>
                        最新のAI技術（OpenAI GPT-4o-mini）を活用した、見積書自動生成デモです。<br />
                        過去の見積もりデータを参考に、適正価格を瞬時に算出します。
                    </p>
                </FadeIn>

                <FadeIn delay={100}>
                    <div className={styles.demoBox}>
                        <div className={styles.inputArea}>
                            <label className={styles.label}>今回の見積もり条件を入力してください</label>
                            <textarea
                                className={styles.textarea}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="例：自動車部品のブラケット50個、SUS304、レーザーカット、曲げ加工、納期2週間"
                            />
                        </div>

                        <div className={styles.controls}>
                            <button
                                onClick={handleGenerateSample}
                                className={styles.sampleBtn}
                                disabled={loadingSample || loading || remainingUses <= 0}
                            >
                                {loadingSample ? "生成中..." : "サンプルを自動生成"}
                            </button>
                            <button
                                onClick={handleGenerate}
                                className={styles.generateBtn}
                                disabled={loading || loadingSample || !input.trim() || remainingUses <= 0}
                            >
                                {loading ? "生成中..." : "見積もりを作成"}
                            </button>
                        </div>
                        <p className={styles.limit}>本日あと {remainingUses} 回利用可能</p>

                        {error && <p className={styles.error}>{error}</p>}

                        {result && (
                            <div className={styles.result}>
                                <h3>見積書（自動生成）</h3>

                                <div className={styles.resultSection}>
                                    <h4>今回のご依頼内容</h4>
                                    <div className={styles.resultContent}>
                                        <p><strong>業種：</strong>{result.projectType}</p>
                                        <p><strong>品目：</strong>{result.requestDetails.item}</p>
                                        <p><strong>詳細：</strong>{result.requestDetails.description}</p>
                                        <p><strong>数量：</strong>{result.requestDetails.quantity}</p>
                                        <p><strong>納期：</strong>{result.requestDetails.deadline}</p>
                                    </div>
                                </div>

                                <div className={styles.resultSection}>
                                    <h4>見積金額</h4>
                                    <div className={styles.estimateTable}>
                                        {result.estimate.breakdown.map((category, idx) => (
                                            <div key={idx} className={styles.category}>
                                                <h5>{category.category}</h5>
                                                {category.items.map((item, itemIdx) => (
                                                    <div key={itemIdx} className={styles.item}>
                                                        <span className={styles.itemName}>{item.name}</span>
                                                        <span className={styles.itemCalc}>
                                                            @{formatCurrency(item.unitPrice)}円 × {item.quantity}
                                                        </span>
                                                        <span className={styles.itemAmount}>
                                                            {formatCurrency(item.amount)}円
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <div className={styles.totalSection}>
                                            <div className={styles.totalLine}>
                                                <span>小計</span>
                                                <span>{formatCurrency(result.estimate.subtotal)}円</span>
                                            </div>
                                            <div className={styles.totalLine}>
                                                <span>消費税（10%）</span>
                                                <span>{formatCurrency(result.estimate.tax)}円</span>
                                            </div>
                                            <div className={styles.totalLineFinal}>
                                                <span>合計</span>
                                                <span>{formatCurrency(result.estimate.total)}円</span>
                                            </div>
                                        </div>
                                        <div className={styles.notes}>
                                            <p><strong>有効期限：</strong>{result.estimate.validityPeriod}</p>
                                            {result.estimate.notes.map((note, idx) => (
                                                <p key={idx}>※ {note}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.resultSection}>
                                    <h4>💡 AIによる分析</h4>
                                    <div className={styles.resultContent}>
                                        <div className={styles.pastEstimates}>
                                            <h5>過去の類似見積もり</h5>
                                            {result.pastEstimates.map((past, idx) => (
                                                <div key={idx} className={styles.pastItem}>
                                                    <p><strong>{past.date}：</strong>{past.description}</p>
                                                    <p>数量：{past.quantity}　単価：@{formatCurrency(past.unitPrice)}円　合計：{formatCurrency(past.total)}円</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.analysis}>
                                            <p><strong>→ 今回見積もり：</strong>@{formatCurrency(result.analysis.currentUnitPrice)}円</p>
                                            <p>{result.analysis.priceConsistency}</p>
                                            <p><strong>想定利益率：</strong>{result.analysis.profitMargin}（{result.analysis.profitComment}）</p>
                                        </div>
                                        <div className={styles.suggestions}>
                                            <h5>提案</h5>
                                            <ul>
                                                {result.suggestions.map((suggestion, idx) => (
                                                    <li key={idx}>{suggestion}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cta}>
                                    <h4>💼 このような見積もり業務の自動化、貴社でも実現できます</h4>
                                    <ul>
                                        <li>✅ 過去データを学習して自動見積もり</li>
                                        <li>✅ 価格の妥当性を瞬時に判断</li>
                                        <li>✅ 見積もり作成時間を90%削減</li>
                                    </ul>
                                    <div className={styles.ctaButtons}>
                                        <a href="#contact" className={styles.ctaButton}>無料相談を予約する</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
