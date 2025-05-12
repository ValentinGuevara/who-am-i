import React from 'react';

import Link from 'next/link';

import { Place, getPlaces } from '@/app/actions/places';
import { getCaptchaToken } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

import { format } from 'date-fns';
import { ArrowUpDown, Calendar as CalendarIcon, ChevronDown, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export const columns: ColumnDef<Place>[] = [
    {
        accessorKey: 'location',
        header: () => <span>Lieu</span>,
        cell: ({ row }) => {
            const id = row.getValue<string>('location').substring(5);

            return (
                <Link
                    className='font-medium text-blue-600 underline'
                    href={`https://www.google.com/maps/place/?q=place_id:${id}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {id.length > 12 ? `${id.slice(0, 12)}...` : id}
                </Link>
            );
        }
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <Button
                    className='flex w-full items-start justify-start px-0'
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <span>Type</span>
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className='pl-2'>{row.getValue<string>('type').toUpperCase()}</div>
    },
    {
        accessorKey: 'date',
        header: () => <span>Date</span>,
        cell: ({ row }) => {
            if (!row.getValue('date')) {
                return <div className='font-medium'></div>;
            }
            const _date = format(row.getValue('date'), 'dd/MM/yyyy');

            return <div className='font-medium'>{_date}</div>;
        }
    },
    {
        accessorKey: 'createdAt',
        header: () => <span>Ajouté le</span>,
        cell: ({ row }) => {
            const _date = format(row.getValue('createdAt'), 'dd/MM/yyyy');

            return <div className='font-medium'>{_date}</div>;
        }
    }
];

export function PlacesDataTable() {
    const [page, setPage] = React.useState<{
        pageIndex: number;
    }>({
        pageIndex: -1
    });
    const [places, setPlaces] = React.useState<Place[]>([]);
    const [lastEvaluatedKeys, setLastEvaluatedKeys] = React.useState<string[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const refreshPlaces = async () => {
        try {
            const token = await getCaptchaToken();
            const keyToUse = lastEvaluatedKeys[page.pageIndex] || null;

            const response = await getPlaces(token, keyToUse);
            if (!response.success) {
                return toast('Une erreur est survenue', {
                    description: response.message
                });
            }
            if (response.places) {
                setPlaces(response.places.items);
                setLastEvaluatedKeys((prev) => {
                    const newKey = response.places?.lastEvaluatedKey as string;
                    if (newKey && !prev.includes(newKey)) {
                        return [...prev, newKey];
                    }

                    return prev;
                });
            }
        } catch (error) {
            toast('Une erreur est survenue', {
                description: 'Impossible de récupérer les données.'
            });
        }
    };

    const previousPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const newNumberPage = page.pageIndex > 0 ? page.pageIndex - 1 : -1;
        setPage({
            pageIndex: newNumberPage
        });
    };

    const nextPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setPage({
            pageIndex: page.pageIndex + 1
        });
    };

    React.useEffect(() => {
        refreshPlaces();
    }, [page]);

    const table = useReactTable({
        data: places,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    });

    console.log('PlacesDataTable', page);
    console.log('Evaluated', lastEvaluatedKeys);

    return (
        <div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    Pas d'évènement.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <div className='space-x-2'>
                    <Button variant='outline' size='sm' onClick={previousPage} disabled={page.pageIndex === -1}>
                        Précédent
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={nextPage}
                        disabled={
                            !lastEvaluatedKeys[page.pageIndex + 1] || lastEvaluatedKeys[page.pageIndex + 1] === ''
                        }>
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
