'use client';

import * as React from 'react';

import Image from 'next/image';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';

import { DatePicker } from './places-date';
import { PlacesDataTable } from './places-table';

export type TypeSelect = 'pro' | 'fun' | 'meetup';
export function PlacesCard() {
    const [location, setLocation] = React.useState<string>('');
    const [type, setType] = React.useState<string>();
    const [date, setDate] = React.useState<Date>();

    const searchLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log('Searching for location:', event.target.value);
        setLocation(event.target.value);
    };

    const isFormNotValid = !location || !type || (type === 'meetup' && !date);

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Partagez vos recommandations</CardTitle>
                <CardDescription>
                    La communauté est le lien social qui manque à l'environnement tech. On la construit ensemble ?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='grid w-full items-center gap-4'>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor='place'>Lieu</Label>
                            <Input
                                onChange={searchLocation}
                                id='place'
                                placeholder='Je vous écoute...'
                                value={location}
                            />
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
