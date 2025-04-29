import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Calendar } from '@/registry/new-york-v4/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerProps {
    disabled?: boolean;
    date?: Date;
    onDateSelected?: (date: Date) => void;
}
export const DatePicker: React.FC<DatePickerProps> = ({ disabled, date, onDateSelected }) => {
    return (
        <Popover>
            <PopoverTrigger disabled={disabled} asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'dd/MM/yyyy') : <span>Sélectionnez</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    disabled={disabled}
                    selected={date}
                    onSelect={onDateSelected as SelectSingleEventHandler}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
