"use client";

import { useState } from "react";
import styles from "./Demo.module.css";
import FadeIn from "./FadeIn";

const SAMPLE_TEXT = `
日時：2024年11月30日 10:00-11:00
参加者：田中、鈴木、佐藤（記録）
議題：次期プロジェクト「Alpha」の進捗確認と課題共有

1. 進捗状況
田中：フロントエンドの実装は概ね予定通り。ログイン画面のバリデーションで少し手こずっているが、明日中には完了予定。
鈴木：バックエンドのAPI設計が完了。現在、DB設計のレビュー待ち。
佐藤：デザインに関しては、TOPページの修正案をデザイナーに依頼済み。来週火曜日に初稿が上がってくる予定。

2. 課題
田中：使用しているライブラリのバージョン互換性に問題が見つかった。最新版に上げると動かない機能がある。
鈴木：AWSのコストが想定より高くなっている。開発環境のインスタンスサイズを見直す必要があるかもしれない。

3. 決定事項
・ライブラリについては、一旦現状のバージョンのまま進め、リリース後にアップデートを検討する。
・AWSコストについては、鈴木さんが来週中にコスト削減案を作成し、共有する。
・次回の定例は12月7日（木）10:00から実施する。

4. ネクストアクション
・田中：ログイン画面の実装完了（明日まで）
・鈴木：DB設計レビュー依頼、AWSコスト削減案作成（来週中）
・佐藤：デザイナーからの修正案確認（来週火曜以降）
`;

interface AnalysisResult {
    summary: string;
    decisions: string[];
    nextActions: string[];
}

export default function Demo() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [remainingUses, setRemainingUses] = useState(5);

    const handleLoadSample = () => {
        setInput(SAMPLE_TEXT.trim());
        setError("");
    };

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        if (remainingUses <= 0) {
            setError("本日の利用回数制限に達しました。");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/demo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: input }),
            });

            if (!response.ok) {
                throw new Error("分析に失敗しました。");
            }

            const data = await response.json();
            setResult(data);
            setRemainingUses((prev) => prev - 1);
        } catch (err) {
            setError("エラーが発生しました。もう一度お試しください。");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="demo" className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <h2 className={styles.heading}>AI DEMO</h2>
                    <p className={styles.description}>
                        最新のAI技術（OpenAI GPT-4o-mini）を活用した、議事録要約デモです。<br />
                        長文の会議メモから、要約・決定事項・タスクを瞬時に抽出します。
                    </p>
                </FadeIn>

                <FadeIn delay={100}>
                    <div className={styles.demoBox}>
                        <div className={styles.inputArea}>
                            <label className={styles.label}>会議メモ入力</label>
                            <textarea
                                className={styles.textarea}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="ここに議事録や会議メモを入力してください..."
                            />
                        </div>

                        <div className={styles.controls}>
                            <button onClick={handleLoadSample} className={styles.sampleBtn}>
                                サンプルを読み込む
                            </button>
                            <button
                                onClick={handleAnalyze}
                                className={styles.analyzeBtn}
                                disabled={loading || !input.trim() || remainingUses <= 0}
                            >
                                {loading ? "分析中..." : "AIで解析する"}
                            </button>
                        </div>
                        <p className={styles.limit}>本日あと {remainingUses} 回利用可能</p>

                        {error && <p className={styles.error}>{error}</p>}

                        {result && (
                            <div className={styles.result}>
                                <h3>解析結果</h3>
                                <div className={styles.resultSection}>
                                    <h4>要約</h4>
                                    <div className={styles.resultContent}>{result.summary}</div>
                                </div>
                                <div className={styles.resultSection}>
                                    <h4>決定事項</h4>
                                    <div className={styles.resultContent}>
                                        <ul>
                                            {result.decisions.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.resultSection}>
                                    <h4>ネクストアクション</h4>
                                    <div className={styles.resultContent}>
                                        <ul>
                                            {result.nextActions.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
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
