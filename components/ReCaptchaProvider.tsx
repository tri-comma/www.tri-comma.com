"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "body",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
