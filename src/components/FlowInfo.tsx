import {
  decrementYearMonth,
  incrementYearMonth,
  setFilterData,
} from '@/redux/features/Filter/dateSlice';
import { useAppSelector } from '@/redux/hooks';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, LucideListFilter } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function FlowInfo() {
  const data = useAppSelector((state) => state.payments);
  const { yearMonth, expense, income, balance } = useAppSelector(
    (state) => state.dateSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilterData(data));
  }, [data, yearMonth]);

  const isBalancePositive =
    Math.sign(balance) === 1 || Math.sign(balance) === 0;

  return (
    <header className='flex px-8 py-3 flex-col sticky top-0 backdrop-blur-sm border-b-2 mb-4'>
      <h3 className='flex border-none justify-between items-center mb-2'>
        <ChevronLeft
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(decrementYearMonth());
          }}
        />
        {format(new Date(yearMonth), 'MMMM, yyyy')}
        <ChevronRight
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(incrementYearMonth());
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
      <LucideListFilter
        role='button'
        className='absolute top-3 h-10 w-10 p-2 -right-2 hover:bg-secondary rounded-md'
      />
    </header>
  );
}
