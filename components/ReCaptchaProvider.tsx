"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

    // Skip reCAPTCHA if no site key is provided (for local development)
    if (!recaptchaSiteKey) {
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
