import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export async function getCaptchaToken(): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
        grecaptcha.ready(async () => {
            const captchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
            if (!captchaKey) {
                return resolve(null)
            }
            const token = await grecaptcha.execute(captchaKey, { action: 'submit' });
            resolve(token);
        });
    });
}

export async function verifyCaptcha(token: string): Promise<{  success: boolean; action: string; score: number }> {
    const serverKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!serverKey) {
        throw new Error('Secret key is not defined');
    }
    const url = new URL('https://www.google.com/recaptcha/api/siteverify');
    url.searchParams.append('secret', serverKey);
    url.searchParams.append('response', token);
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    return data;
}
