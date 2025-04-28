import React from 'react';

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

const data: Payment[] = [
    // {
    //     id: 'm5gr84i9',
    //     amount: 316,
    //     status: 'success',
    //     email: 'ken99@example.com'
    // },
    // {
    //     id: '3u1reuv4',
    //     amount: 242,
    //     status: 'success',
    //     email: 'Abe45@example.com'
    // },
    // {
    //     id: 'derv1ws0',
    //     amount: 837,
    //     status: 'processing',
    //     email: 'Monserrat44@example.com'
    // },
    // {
    //     id: '5kma53ae',
    //     amount: 874,
    //     status: 'success',
    //     email: 'Silas22@example.com'
    // },
    // {
    //     id: 'bhqecj4p',
    //     amount: 721,
    //     status: 'failed',
    //     email: 'carmella@example.com'
    // }
];

export type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'location',
        header: () => <div className='text-center'>Lieu</div>,
        cell: ({ row }) => <div>{row.getValue('location')}</div>
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <Button
                    className='flex w-full items-center justify-center'
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <span className='text-center'>Type</span>
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className='capitalize'>{row.getValue('type')}</div>
    },
    {
        accessorKey: 'date',
        header: () => <div className='text-center'>Date</div>,
        cell: ({ row }) => {
            const _date = format(row.getValue('date'), 'dd/MM/yyyy');

            return <div className='font-medium'>{_date}</div>;
        }
    }
];

export function PlacesDataTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    });

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
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Précédent
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
