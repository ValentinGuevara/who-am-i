'use client';

import { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { PlacesCard } from '@/components/places/places-card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/registry/new-york-v4/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/new-york-v4/ui/tooltip';

import Autoplay from 'embla-carousel-autoplay';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

/**
 * The main page component that renders the HomePage component.
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
const Page = (): JSX.Element => {
    const images = ['/images/1.jpeg', '/images/2.jpeg', '/images/3.jpeg'];

    const startDownload = () => {
        toast('Démarrage du téléchargement', {
            description: 'Dernière version sur AWS S3'
        });
        saveAs('/CV_Guevara_Valentin.pdf', 'CV_Guevara_Valentin.pdf');
    };

    return (
        <main className='mx-auto mt-6 flex max-w-7xl flex-col justify-center gap-6 px-3 font-[family-name:var(--font-geist-sans)] sm:mt-3 sm:gap-12 sm:px-0'>
            <div className='row-start-2 flex flex-col items-center justify-center gap-8'>
                <div className='flex items-baseline gap-2 align-text-bottom'>
                    <h2 className='text-xl'>Je suis</h2>
                    <h1 className='text-4xl font-bold'> Valentin Guevara</h1>
                </div>
                <div className='mx-12 flex flex-col items-center lg:mx-46'>
                    <span className='text-md text-center font-medium'>
                        Je viens d'un village où chaque pas compte. Aujourd'hui,{' '}
                        <a
                            className='underline underline-offset-4'
                            href='https://www.youtube.com/watch?v=mvN2Cv8uFvM'
                            target='_blank'
                            rel='noopener noreferrer'>
                            je foule une nouvelle scène
                        </a>{' '}
                        avec une ambition claire : <span className='text-xl font-bold'>construire</span>,{' '}
                        <span className='text-xl font-bold'>grandir</span>,{' '}
                        <span className='text-xl font-bold'>laisser une trace</span>.
                    </span>
                    <span className='text-md mt-4 text-center font-medium'>
                        Déterminé, prêt à tout pour atteindre mon objectif, je suis venu relever le défi du plus grand
                        terrain international. Envie d’un bon plan, d’une aventure, d’un projet qui surprend ?
                    </span>
                </div>
                <Carousel
                    className='w-full max-w-lg'
                    plugins={[
                        Autoplay({
                            delay: 7000
                        })
                    ]}>
                    <CarouselContent>
                        {images.map((_, index) => (
                            <CarouselItem key={index}>
                                <div className='overflow-hidden rounded-lg'>
                                    <Image
                                        src={images[index]}
                                        alt={`Image ${index + 1}`}
                                        width={0}
                                        height={0}
                                        sizes='100vw'
                                        style={{ width: '100%', height: 'auto' }}
                                        priority
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className='flex flex-col space-y-2 sm:row-start-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className='cursor-pointer' size='lg' variant='outline'>
                                    <Image
                                        aria-hidden
                                        src='/mouse-pointer-click.svg'
                                        alt='File icon'
                                        width={16}
                                        height={16}
                                    />
                                    <Link href='https://wa.me/33608144214' target='_blank' rel='noopener noreferrer'>
                                        Ecrivez sur WhatsApp
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Démarrons l'aventure ensemble</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button className='cursor-pointer' size='lg' variant='outline' onClick={startDownload}>
                        <Image aria-hidden src='/download.svg' alt='File icon' width={16} height={16} />
                        Téléchargez mon CV (EN)
                    </Button>
                    <Button className='cursor-pointer' size='lg' variant='outline'>
                        <Link
                            href='https://calendly.com/valentin-guevara/30min'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Prenons un café
                        </Link>
                        <Image aria-hidden src='/message-square-share.svg' alt='File icon' width={16} height={16} />
                    </Button>
                </div>
                <div className='mb-4 flex flex-col items-center justify-center'>
                    <PlacesCard />
                </div>
            </div>
        </main>
    );
};

export default Page;
