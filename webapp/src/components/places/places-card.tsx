'use client';

import * as React from 'react';

import Image from 'next/image';

import { Place, postPlace } from '@/app/actions/places';
import { getCaptchaToken } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';

import { DatePicker } from './places-date';
import { PlacesSearch } from './places-search';
import { PlacesDataTable } from './places-table';
import { toast } from 'sonner';

export type TypeSelect = 'pro' | 'fun' | 'meetup';
export function PlacesCard() {
    const [location, setLocation] = React.useState<string>('');
    const [type, setType] = React.useState<string>();
    const [date, setDate] = React.useState<Date>();

    const isFormNotValid = !location || !type || (type === 'meetup' && !date);

    const sendPlace = async () => {
        try {
            const token = await getCaptchaToken();
            const response = await postPlace(token, {
                location,
                type: type as Place['type'],
                date: type === 'meetup' ? date : undefined
            });
            if (!response.success) {
                return toast('Une erreur est survenue', {
                    description: response.message
                });
            }
            toast('Envoi du lieu...', {
                description: 'Merci beaucoup pour ta proposition !'
            });
        } catch (error) {
            toast('Une erreur est survenue', {
                description: "Impossible d'envoyer les données."
            });
        }
    };

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Partagez vos recommandations</CardTitle>
                <CardDescription>
                    La communauté et le lien social, pilier de l'environnement tech. On le fait grandir ensemble ?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='grid w-full items-center gap-4'>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor='place'>Lieu</Label>
                            <PlacesSearch onPlaceSelected={(currentPlaceId: string) => setLocation(currentPlaceId)} />
                        </div>
                        <div className='po flex flex-col space-y-1.5'>
                            <Label htmlFor='type'>Type d'adresse</Label>
                            <Select onValueChange={(value: TypeSelect) => setType(value)}>
                                <SelectTrigger id='type' className='cursor-pointer'>
                                    <SelectValue placeholder='Sélectionnez' />
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                    <SelectItem value='pro'>Professionnelle</SelectItem>
                                    <SelectItem value='fun'>Loisirs</SelectItem>
                                    <SelectItem value='meetup'>Meetup / Conférence</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor='date'>Date de l'évènement</Label>
                            <div className='flex items-center justify-between space-x-2'>
                                <DatePicker
                                    disabled={!type || type !== 'meetup'}
                                    date={date}
                                    onDateSelected={(date: Date) => setDate(date)}
                                />
                                <Button
                                    disabled={isFormNotValid}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        sendPlace();
                                    }}
                                    className='cursor-pointer'
                                    size='lg'
                                    variant='outline'>
                                    Envoyer
                                    <Image
                                        aria-hidden
                                        src='/send-horizontal.svg'
                                        alt='Send icon'
                                        width={16}
                                        height={16}
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-1.5'>
                            <PlacesDataTable />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
