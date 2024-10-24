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
  useReactTable,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/types/constant';
import { format } from 'date-fns';

const formattedAmount = (amount: any, currency?: boolean) => {
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    currency: 'INR',
  }).format(amount);
};

export const columns: ColumnDef<Transaction>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const formatedDate = format(row.getValue('date'), 'dd-MMM-yy');
      return <div className='font-medium'>{formatedDate}</div>;
    },
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('mode')}</div>,
  },
  {
    accessorKey: 'refNo',
    header: 'Ref No.',
    cell: ({ row }) => <div className=''>{row.getValue('refNo')}</div>,
  },
  {
    accessorKey: 'credit',
    header: 'Credit',
    cell: ({ row }) => {
      const amount = row.getValue('credit');
      return (
        <div className='font-medium text-green-600 dark:text-green-400'>
          {amount ? `+${formattedAmount(amount)}` : ''}
        </div>
      );
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'debit',
    header: 'Debit',
    cell: ({ row }) => {
      const amount = row.getValue('debit');
      return (
        <div className='font-medium text-red-600 dark:text-red-400'>
          {amount ? `-${formattedAmount(amount)}` : ''}
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Email
  //         <ArrowUpDown className='ml-2 h-4 w-4' />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  // },
  {
    accessorKey: 'balance',
    header: () => <div className='text-right'>Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'));

      // Format the amount as a dollar amount
      const formatted = formattedAmount(amount, true);

      return <div className='text-right font-medium'>{formatted}</div>;
    },
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant='ghost' className='h-8 w-8 p-0'>
  //             <span className='sr-only'>Open menu</span>
  //             <MoreHorizontal className='h-4 w-4' />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end'>
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function DataTable({ data }: { data: Transaction[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'date', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
      rowSelection,
    },
  });
  const page = table.getState().pagination.pageIndex;
  const pages = table.getPageOptions();
  const newPages = pages.slice(Math.min(0 + page, pages.length - 8), 8 + page);
  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter Ref No...'
          value={(table.getColumn('refNo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('refNo')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='cursor-pointer'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <section className='flex max-sm:flex-col max-sm:gap-2 items-center justify-between py-4 space-x-1'>
        <div className='flex items-center space-x-2'>
          <span>Rows per page:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center'>
              <Button variant='ghost'>
                {table.getState().pagination.pageSize}
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='!w-16'>
              {[10, 15, 25, 50, 100].map((pageSize) => (
                <DropdownMenuItem onClick={() => table.setPageSize(pageSize)}>
                  {pageSize}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='flex place-items-center space-x-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            onDoubleClick={() => table.firstPage()}
          >
            <ArrowLeft />
          </Button>
          {newPages.map((pageIdx) => (
            <Button
              variant={page === pageIdx ? 'secondary' : 'outline'}
              size='sm'
              onClick={() => table.setPageIndex(pageIdx)}
            >
              {pageIdx + 1}
            </Button>
          ))}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            onDoubleClick={() => table.lastPage()}
          >
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
}
