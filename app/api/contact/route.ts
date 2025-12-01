import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, theme, message, recaptchaToken } = body;

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

        const webhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const slackMessage = {
            text: `<!channel> *New Contact Form Submission*`,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `<!channel> *New Contact Form Submission*\n\n*Name:*\n${name}\n\n*Email:*\n${email}\n\n*Theme:*\n${theme}\n\n*Subject:*\n${subject}\n\n*Message:*\n${message}`,
                    },
                },
            ],
        };

        const slackRes = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackMessage),
        });

        if (!slackRes.ok) {
            throw new Error("Failed to send to Slack");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending to Slack:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
