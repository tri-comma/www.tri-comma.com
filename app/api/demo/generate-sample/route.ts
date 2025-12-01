import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { recaptchaToken } = await request.json();

        // Verify reCAPTCHA token
        if (recaptchaToken) {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

            const verifyResponse = await fetch(verifyUrl, { method: "POST" });
            const verifyData = await verifyResponse.json();

            if (!verifyData.success || verifyData.score < 0.5) {
                return NextResponse.json(
                    { error: "reCAPTCHA verification failed" },
                    { status: 403 }
                );
            }
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `あなたは中小企業の見積もり条件を生成する専門家です。

毎回異なる業界の見積もり条件を生成してください。
Web関連に偏らず、製造業、建設業、卸売業など幅広い業界から選んでください。

具体的で現実的な条件を1-2行で簡潔に記載してください。`
                },
                {
                    role: "user",
                    content: `以下の業界からランダムに1つ選び、その業界の見積もり条件を生成してください。

業界リスト：
1. 金属加工（レーザーカット、曲げ加工、溶接、旋盤加工など）
2. プラスチック加工（射出成形、真空成形など）
3. 木工・家具製作
4. 印刷・製本（チラシ、冊子、名刺など）
5. 飲食店内装工事
6. オフィス内装・リフォーム
7. 外構工事・エクステリア
8. 電気工事
9. 部品卸売（ボルト、ナット、ベアリングなど）
10. 食材・食品卸
11. 事務用品卸
12. 清掃・メンテナンス
13. 運送・配送
14. イベント設営
15. 撮影・動画制作
16. デザイン（ロゴ、パンフレット、パッケージ）
17. Webサイト制作
18. システム開発

【出力フォーマット（JSON）】
{
  "sampleText": "見積もり条件"
}

【良い例】
{"sampleText": "SUS304ステンレス板のレーザーカット、t3.0×300×400mm、50枚、バリ取り込み、納期2週間"}
{"sampleText": "M8六角ボルト（SUS304）5,000本、M8ナット5,000個の卸売、納期1週間"}
{"sampleText": "オフィス会議室の内装工事、15坪、壁紙張替え、カーペット敷設、照明交換"}
{"sampleText": "A4チラシ両面カラー印刷、コート紙90kg、3,000部、折り加工なし"}
{"sampleText": "アルミ角パイプ（40×40×2.0）のカット加工、200本、各1500mm、バリ取り"}
{"sampleText": "飲食店厨房機器の搬入・設置、冷蔵庫2台、作業台3台、シンク1台"}
{"sampleText": "木製テーブル（W1800×D900×H720）5台、オーク材、オイル仕上げ"}
{"sampleText": "駐車場ライン引き工事、100台分、白線・番号表示込み"}

上記の例を参考に、選んだ業界の見積もり条件を生成してください。`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const data = JSON.parse(content);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process request" },
            { status: 500 }
        );
    }
}
