import styles from "./About.module.css";
import FadeIn from "./FadeIn";

export default function About() {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <h2 className={styles.heading}>About</h2>
                </FadeIn>

                <div className={styles.grid}>
                    <FadeIn delay={200} className={styles.profile}>
                        <img
                            src="/About.png"
                            alt="Profile"
                            className={styles.profileImage}
                        />
                    </FadeIn>

                    <FadeIn delay={400} className={styles.content}>
                        <h3 className={styles.subHeading}>
                            TRI-COMMA（トライカンマ）
                        </h3>
                        <p className={styles.intro}>
                            葛飾区を中心に活動するITの個人事業主です。「大企業の品質」と「個人ならではのスピード」を両立し、お客様のビジネス課題を技術で解決します。
                        </p>

                        <h4 className={styles.concept}>
                            大手向けシステム開発の経験豊富さと
                            <br />
                            個人としての柔軟性。
                        </h4>
                        <p className={styles.text}>
                            1999年からIT業界に携わり、メガバンクの大規模システム開発・Webサイト制作および運用・エンタメ系アプリ開発など様々な分野で経験を積みました。
                            2016年に個人事業主として創業以来、エンタープライズ領域で大規模プロジェクトのマネジメント(PM)業の請負を続けており、そのかたわら小規模のシステムエンジニアリングにも従事してきました。
                            大規模システムの堅牢さと、個人開発ならではのスピード感を両立し、お客様のビジネス課題を技術で解決します。
                        </p>

                        <div className={styles.qualifications}>
                            <h4>保有国家資格</h4>
                            <ul>
                                <li>第一種情報処理技術者(13204387号)</li>
                                <li>テクニカルエンジニアネットワーク(NW-2002-10-01605号)</li>
                                <li>テクニカルエンジニアデータベース(DB-2003-04-00054号)</li>
                                <li>アプリケーションエンジニア(AE-2003-10-00351号)</li>
                            </ul>
                        </div>
                    </FadeIn>
                </div>

                <FadeIn delay={600} className={styles.achievementsSection}>
                    <h4>主な実績</h4>
                    <div className={styles.achievementsGrid}>
                        <div className={styles.achievementItem}>
                            <h5>大手金融アプリ・小売系アプリ（100万ユーザー規模）のリニューアルPM</h5>
                            <div className={styles.achievementDetail}>
                                <p><span className={styles.label}>Before:</span> ストア評価 ★2〜3、ユーザー離脱・クレーム多発</p>
                                <p><span className={styles.label}>After:</span> <span className={styles.highlight}>★4以上に改善</span>、継続率・満足度が大幅向上</p>
                                <p className={styles.role}><span className={styles.label}>担当:</span> プロジェクト全体管理、UX改善提案、品質管理、ベンダーコントロール</p>
                            </div>
                        </div>
                        <div className={styles.achievementItem}>
                            <h5>外構工事会社のWebサイトリニューアル＋運用サポート</h5>
                            <div className={styles.achievementDetail}>
                                <p><span className={styles.label}>Before:</span> 問い合わせがほぼゼロ、集客に課題</p>
                                <p><span className={styles.label}>After:</span> <span className={styles.highlight}>月3件以上の安定した問い合わせ獲得</span></p>
                                <p className={styles.role}><span className={styles.label}>担当:</span> サイト設計、SEO対策、運用サポート、効果測定</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
