import {
  decrementDateFilter,
  incrementDateFilter,
  setFilterData,
} from '@/redux/features/Filter/dateSlice';
import { useAppSelector } from '@/redux/hooks';
import { formattedAmount } from '@/utils/helper';
import { ChevronLeft, ChevronRight, LucideListFilter } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setFilter } from '@/redux/features/Filter/filterSlice';
import { FilterOption } from '@/types/constant';
import { format } from 'date-fns';

export default function FlowInfo() {
  const data = useAppSelector((state) => state.payments);
  const { filter } = useAppSelector((state) => state.filter);
  const { dateFilter, expense, income, balance } = useAppSelector(
    (state) => state.dateSlice
  );
  const dispatch = useDispatch();

  const isBalancePositive =
    Math.sign(balance) === 1 || Math.sign(balance) === 0;

  const showDate = format(new Date(dateFilter), filter.format);
  const handleFilter = (key: string) => {
    dispatch(setFilter(key));
  };
  useEffect(() => {
    dispatch(setFilterData(data));
  }, [data, dateFilter]);

  return (
    <header className='flex px-8 py-3 flex-col sticky top-0 backdrop-blur-sm border-b-2 mb-4'>
      <h3 className='flex border-none justify-between items-center mb-2'>
        <ChevronLeft
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(decrementDateFilter(filter.name));
          }}
        />
        {showDate}
        <ChevronRight
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(incrementDateFilter(filter.name));
          }}
        />
      </h3>
      <h4 className='flex justify-between'>
        <div className='flex flex-col text-left'>
          <span>Expense </span>
          <span className='text-red-600 dark:text-red-400 '>
            {`${formattedAmount(expense, true)}`}
          </span>
        </div>
        <div className='flex flex-col text-center'>
          <span>Income</span>
          <span className='text-green-600 dark:text-green-400 '>
            {`${formattedAmount(income, true)}`}
          </span>
        </div>
        <div className='flex flex-col text-right'>
          <span>Balance </span>
          <span
            className={
              isBalancePositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }
          >
            {`${formattedAmount(balance, true)}`}
          </span>
        </div>
      </h4>

      <DropdownMenu>
        <DropdownMenuTrigger className='absolute top-3 -right-2 outline-none'>
          <LucideListFilter
            role='button'
            className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='absolute -right-5'>
          <DropdownMenuLabel>Display Option</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(FilterOption).map(([key, value]) => {
            return (
              <DropdownMenuItem
                key={key}
                className={value.name === filter.name ? 'bg-secondary' : ''}
                onClick={() => handleFilter(key)}
              >
                {value.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
