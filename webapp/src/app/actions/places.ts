"use server";

import { verifyCaptcha } from '@/lib/utils';
import { after } from 'next/server';

export type Place = {
    location: string;
    type: 'pro' | 'fun' | 'meetup';
    date?: Date;
    createdAt?: Date;
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
        return {
            success: false,
            message: 'No Maps Google credentials',
        };
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
    const placesApiKey = process.env.PLACES_API_KEY;
    if (!placesApiKey) {
        return {
            success: false,
            message: 'No custom backend API credentials',
        };
    }
    const url = new URL(process.env.PLACES_API_URL as string);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': placesApiKey,
        },
        body: JSON.stringify({
            id: place.location,
            type: place.type,
            date: place.date ? place.date.toISOString() : undefined,
        }),
    });
    const data = await response.json();
    if (!response.ok) {
        return {
            success: false,
            message: data.message,
        };
    }

    after(async () => {
        console.log('Data sent to backend, increment a counter for monitoring...');
    });

    return {
        success: true,
        message: 'Place sent successfully',
        place: data,
    };
}

export async function getPlaces(token: string | null, lastKey: string | null): Promise<{
    success: boolean;
    message: string;
    places?: {
        items: Place[];
        lastEvaluatedKey?: string;
    };
}>{
    if(!(await checkToken(token))) {
        return {
            success: false,
            message: 'Captcha verification failed',
        };
    }
    const placesApiKey = process.env.PLACES_API_KEY;
    if (!placesApiKey) {
        return {
            success: false,
            message: 'No custom backend API credentials',
        };
    }
    const url = new URL(process.env.PLACES_API_URL as string);
    if(lastKey) {
            url.searchParams.set('lastEvaluatedKey', lastKey);
    }
    url.searchParams.set('limit', "7");
    console.log('URL:', url.toString());
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-api-key': placesApiKey,
        }
    });
    const data = await response.json();
    if (!response.ok) {
        return {
            success: false,
            message: data.message,
        };
    }

    return {
        success: true,
        message: 'Places retrieved',
        places: data,
    };
}
