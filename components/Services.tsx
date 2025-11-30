import styles from "./Services.module.css";
import FadeIn from "./FadeIn";

interface ServiceItem {
    title: string;
    subtitle: string;
    description: string;
    image: string | null;
    recommendedFor?: string[];
    pricing?: string[];
    solutionExamples?: string[];
}

export default function Services() {
    const services: ServiceItem[] = [
        {
            title: "Technical Advisory",
            subtitle: "技術顧問 / PM支援",
            description: "大手SIerでのプロジェクトマネジメント経験を活かし、貴社の「外部CTO」として技術的な意思決定をサポートします。ベンダーコントロールから採用支援、開発プロセスの整備まで、経営と現場の橋渡し役としてプロジェクトを成功に導きます。",
            image: "/TechnicalAdvisory.png",
            recommendedFor: [
                "社内にCTO/IT責任者がいない",
                "ベンダーの見積もりが妥当か判断できない",
                "開発プロジェクトの進捗が不安",
                "技術選定を間違えたくない"
            ],
            pricing: [
                "スポット：1時間1万円（初回無料）",
                "ライト：月7万円（1時間MTG月2回 + チャット相談）"
            ]
        },
        {
            title: "Web Development",
            subtitle: "Webサイト制作",
            description: "コーポレートサイトからLP、オウンドメディアまで。Next.jsなどのモダンな技術選定により、SEOに強く、更新しやすいWebサイトを構築します。",
            image: "/WebDevelopment.png",
            pricing: [
                "LP制作：10万円〜",
                "コーポレートサイト(新規)：40〜80万円",
                "コーポレートサイト(リニューアル)：20万円〜",
                "ECサイト：80万円〜"
            ]
        },
        {
            title: "App Development",
            subtitle: "スマートフォンアプリ開発",
            description: "iOS / Android対応のネイティブアプリ、またはクロスプラットフォーム開発。企画段階からストア公開、その後の運用までサポートします。",
            image: "/AppDevelopment.png",
            pricing: [
                "PoC（概念実証）開発：30万円〜",
                "　└ アイデアの実現可能性を検証する試作版",
                "MVP（最小機能製品）開発：80万円〜",
                "　└ 必要最小限の機能でリリース可能な初期バージョン"
            ]
        },
        {
            title: "System Development",
            subtitle: "業務システム開発",
            description: "在庫管理、顧客管理、予約システムなど。業務フローに合わせたオーダーメイドのシステムを開発し、現場のDXを推進します。",
            image: "/SystemDevelopment.png",
            recommendedFor: [
                "業務がExcelや紙の管理で限界を迎えている",
                "既存システムが古く、使い勝手が悪い",
                "パッケージソフトでは自社の業務に合わない",
                "現場の業務効率を劇的に改善したい"
            ],
            pricing: [
                "業務改善コンサル：10万円〜",
                "システム開発：要相談（20万円〜）"
            ]
        },
        {
            title: "DX & AI Solutions",
            subtitle: "業務効率化 / AI活用",
            description: "GASやSlack連携による身近な業務自動化から、最新のAI技術を活用したソリューション提案まで。研究開発に基づいた先進的なアプローチで課題を解決します。",
            image: "/DX_AISolutions.png",
            solutionExamples: [
                "ChatGPT × 社内データ活用",
                "　└ 社内マニュアルや過去のナレッジを回答する専用Botの構築",
                "業務フローの完全自動化",
                "　└ GASやAPI連携を駆使し、転記作業や通知などのルーチン業務をゼロに",
                "SaaS連携 / API開発",
                "　└ Slack, kintone, Salesforce等を連携させ、分断された業務データを統合"
            ]
        },
    ];

    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <h2 className={styles.heading}>Services</h2>
                </FadeIn>
                <div className={styles.list}>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 100} className={styles.item}>
                            <div className={styles.imageWrapper}>
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className={styles.image}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span className={styles.placeholderText}>Image: {service.title}</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{service.title}</h3>
                                <p className={styles.subtitle}>{service.subtitle}</p>
                                <p className={styles.description}>{service.description}</p>

                                {(service.recommendedFor || service.pricing || service.solutionExamples) && (
                                    <div className={styles.details}>
                                        {service.recommendedFor && (
                                            <div className={styles.recommended}>
                                                <h4>こんな方におすすめ</h4>
                                                <ul>
                                                    {service.recommendedFor.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {service.pricing && (
                                            <div className={styles.pricing}>
                                                <h4>料金プラン例</h4>
                                                <ul>
                                                    {service.pricing.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {service.solutionExamples && (
                                            <div className={styles.pricing}>
                                                <h4>提供可能なソリューションの例</h4>
                                                <ul>
                                                    {service.solutionExamples.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
