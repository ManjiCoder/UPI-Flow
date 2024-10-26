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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';

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
    accessorKey: 'id',
    header: 'No.',
    cell: ({ row }) => <div className=''>{row.getValue('id')}</div>,
  },
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
    { id: 'id', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    // { id: 'date', value: '2024-09' },
  ]);
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

  const newPages =
    pages.length > 8
      ? pages.slice(
          Math.min(0 + page, pages.length - 6),
          Math.min(pages.length, 6 + page)
        )
      : pages;

  const totalCredit = table
    .getRowModel()
    .rows.map((row) => row.original.credit)
    .filter(Boolean)
    .reduce((x, y) => {
      // @ts-ignore
      return x + y;
    }, 0);
  const totalDebit = table
    .getRowModel()
    .rows.map((row) => row.original.debit)
    .filter(Boolean)
    .reduce((x, y) => {
      // @ts-ignore
      return x + y;
    }, 0);

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter Date...'
          value={(table.getColumn('date')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('date')?.setFilterValue(event.target.value)
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={table.getVisibleFlatColumns().length - 3}>
                Total
              </TableCell>
              <TableCell className='text-left text-green-600 dark:text-green-400'>
                {totalCredit ? `+${formattedAmount(totalCredit)}` : 0}
              </TableCell>
              <TableCell className='text-left text-red-600 dark:text-red-400'>
                {totalDebit ? `-${formattedAmount(totalDebit)}` : 0}
              </TableCell>
              <TableCell className='text-right'>
                {totalCredit && totalDebit
                  ? formattedAmount(totalCredit - totalDebit, true)
                  : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <section className='flex max-sm:flex-col max-sm:gap-2 items-center justify-between py-4 space-x-1'>
        <div className='flex items-center space-x-2'>
          <span>Rows per page:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center'>
              <Button variant='ghost' className='px-2'>
                {table.getState().pagination.pageSize}
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-14'>
              {[5, 10, 15, 25, 50, 100, 500, 1000].map((pageSize) => (
                <DropdownMenuItem
                  key={pageSize}
                  className='cursor-pointer'
                  onClick={() => table.setPageSize(pageSize)}
                >
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
              key={pageIdx}
              variant={page === pageIdx ? 'secondary' : 'outline'}
              size='sm'
              onClick={() => table.setPageIndex(pageIdx)}
              className='min-w-10'
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
