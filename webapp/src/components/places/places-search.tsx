import React from 'react';

import { searchPlace } from '@/app/actions/places';
import { cn, getCaptchaToken } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/registry/new-york-v4/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';

import debounce from 'lodash.debounce';
import { Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

type Element = { value: string; label: string };
type Location = { placePrediction: { text: { text: string }; placeId: string } };
interface PlacesSearchProps {
    onPlaceSelected: (currentValue: string) => void;
}
export const PlacesSearch: React.FC<PlacesSearchProps> = ({ onPlaceSelected }) => {
    const [locations, setLocations] = React.useState<{ value: string; label: string }[]>([]);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    const searchLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const newLocation = event.target.value;
        if (!newLocation || newLocation === '') {
            setLocations([]);

            return;
        }
        try {
            const _debouncedSearch = debounce(async () => {
                const token = await getCaptchaToken();
                const locationFounds = await searchPlace(token, newLocation);
                const founds = locationFounds.suggestions
                    .map((location: Location) => ({
                        value: JSON.stringify({
                            placeId: location.placePrediction.placeId,
                            text: location.placePrediction.text.text
                        }),
                        label: location.placePrediction.text.text.split(',')[0]
                    }))
                    .filter(
                        (location: Element, index: number, self: Element[]) =>
                            index === self.findIndex((l) => l.label === location.label)
                    );
                setLocations(founds);
            }, 300);
            _debouncedSearch();
        } catch (error) {
            toast('Une erreur est survenue', {
                description: 'Impossible de rechercher les lieux.'
            });
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' role='combobox' aria-expanded={open} className='w-[300px] justify-between'>
                    {value
                        ? locations.find((location) => JSON.parse(location.value).text === value)?.label
                        : 'Recherche sur Google...'}
                    <ChevronsUpDown className='opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput onInput={searchLocation} placeholder='Recherche sur Google...' className='h-9' />
                    <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((location) => {
                                const { text, placeId } = JSON.parse(location.value);

                                return (
                                    <CommandItem
                                        key={text}
                                        value={text}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue);
                                            setOpen(false);
                                            onPlaceSelected(placeId);
                                        }}>
                                        {location.label}
                                        <Check
                                            className={cn('ml-auto', value === text ? 'opacity-100' : 'opacity-0')}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
