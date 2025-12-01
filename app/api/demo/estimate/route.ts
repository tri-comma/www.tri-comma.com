import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { input, recaptchaToken } = await request.json();

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
                    content: `あなたは見積もり作成の専門家です。

【タスク】
1. ユーザーの入力から業界・業態を判断
2. その業界の過去見積もりデータを3件生成（架空でリアルなデータ）
3. 過去データを参考に、今回の見積書を作成
4. 過去データとの比較分析を行う

【重要】
- 金額は現実的な範囲で設定
- 過去データは日付、数量、単価、合計を含める
- 業界用語を適切に使用
- 利益率は業界標準を考慮`
                },
                {
                    role: "user",
                    content: `以下の条件で見積書を作成してください。

【入力内容】
${input}

【出力フォーマット（JSON）】
{
  "projectType": "業界・業態（例：金属加工、Web制作、建設工事など）",
  "requestDetails": {
    "item": "品目・サービス名",
    "description": "詳細説明（1-2行）",
    "quantity": "数量",
    "deadline": "納期"
  },
  "estimate": {
    "breakdown": [
      {
        "category": "費目名",
        "items": [
          {
            "name": "項目名",
            "unitPrice": "単価（数値）",
            "quantity": "数量（数値）",
            "amount": "金額（数値）"
          }
        ]
      }
    ],
    "subtotal": "小計（数値）",
    "tax": "消費税（数値）",
    "total": "合計（数値）",
    "validityPeriod": "有効期限",
    "notes": ["備考1", "備考2"]
  },
  "pastEstimates": [
    {
      "date": "YYYY年MM月",
      "description": "案件の簡単な説明",
      "quantity": "数量",
      "unitPrice": "単価（数値）",
      "total": "合計金額（数値）"
    }
  ],
  "analysis": {
    "currentUnitPrice": "今回の単価（数値）",
    "priceConsistency": "過去との整合性についてのコメント",
    "profitMargin": "想定利益率（パーセンテージ）",
    "profitComment": "利益率についてのコメント"
  },
  "suggestions": ["提案1", "提案2"]
}`
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
