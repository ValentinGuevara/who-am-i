"use server";

import { after } from 'next/server';

export type Place = {
    location: string;
    type: 'pro' | 'fun' | 'meetup';
    date?: Date;
};

export async function postPlace(place: Place) {
    console.log(place);
    after(async () => {
        console.log('Analytics incremented');
    });

    return {
        message: 'Place sent successfully',
        place,
    };
}
