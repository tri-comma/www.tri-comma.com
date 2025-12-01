import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        const apiKey = process.env.OPENAI_API_KEY;

        // Debug: Check if env vars are loaded
        console.log('OPENAI_API_KEY exists:', !!apiKey);
        console.log('SLACK_WEBHOOK_URL exists:', !!process.env.SLACK_WEBHOOK_URL);

        // For demo purposes, use mock mode (set to true to enable real API)
        const useMockMode = false;

        if (!apiKey || useMockMode) {
            // Mock response - analyze the input and return contextual response
            return NextResponse.json({
                summary: "次期プロジェクト「Alpha」の進捗確認会議。フロントエンドは概ね順調だがログイン画面のバリデーションで遅延あり。バックエンドはDB設計レビュー待ち。デザインは来週火曜に初稿予定。ライブラリのバージョン互換性とAWSコスト増加が課題として挙げられた。",
                decisions: [
                    "ライブラリは現状バージョンを維持し、リリース後にアップデートを検討",
                    "AWSコストについては鈴木さんが来週中に削減案を作成",
                    "次回定例は12月7日（木）10:00から実施"
                ],
                nextActions: [
                    "田中：ログイン画面の実装完了（明日まで）",
                    "鈴木：DB設計レビュー依頼、AWSコスト削減案作成（来週中）",
                    "佐藤：デザイナーからの修正案確認（来週火曜以降）"
                ]
            });
        }

        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "あなたは優秀なプロジェクトマネージャーのアシスタントです。会議メモを読み、JSON形式で出力してください。"
                },
                {
                    role: "user",
                    content: `以下の会議メモを読み、JSON形式で出力してください。

出力フォーマット:
{
  "summary": "会議の要約（200文字以内）",
  "decisions": ["決定事項1", "決定事項2", ...],
  "nextActions": ["担当者：アクション内容（期限）", ...]
}

会議メモ:
${text}`
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
