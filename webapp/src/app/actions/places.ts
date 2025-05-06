"use server";

import { verifyCaptcha } from '@/lib/utils';
import { after } from 'next/server';

export type Place = {
    location: string;
    type: 'pro' | 'fun' | 'meetup';
    date?: Date;
};

const checkToken = async (token: string | null): Promise<boolean> => {
    if (!token) {
        return false;
    }
    const response = await verifyCaptcha(token);

    return response && response.success && response.action === 'submit' && response.score >= 0.9;
}

export async function searchPlace(token: string | null, query: string) {
    const mapsKey = process.env.MAPS_API_KEY;
    if (!mapsKey) {
        throw new Error('Maps key is not defined');
    }
    if(!(await checkToken(token))) {
        return {
            success: false,
            message: 'Captcha verification failed',
        };
    }
    const url = new URL('https://places.googleapis.com/v1/places:autocomplete');
    const response = await fetch(url, { method: 'POST', body: JSON.stringify({
        input: query,
        locationBias: {
            // Bias the search to a specific location
            // This example uses the coordinates for Paris, France
            circle: {
                center: {
                    latitude: 48.856199,
                    longitude: 2.352242
                },
                radius: 10000.0
            }
        }
    }), headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': mapsKey,
        'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId',
    }
});
    const data = await response.json();

    return data;
}

export async function postPlace(token: string | null, place: Place) {
    if(!(await checkToken(token))) {
        return {
            success: false,
            message: 'Captcha verification failed',
        };
    }
    after(async () => {
        console.log('Analytics incremented');
    });

    return {
        success: true,
        message: 'Place sent successfully',
        place,
    };
}
