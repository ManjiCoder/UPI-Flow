import {
  decrementYearMonth,
  incrementYearMonth,
  setFilterData,
} from '@/redux/features/Filter/dateSlice';
import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  LucideBadgeIndianRupee,
  LucideCornerLeftUp,
  LucideCornerUpRight,
  LucideListFilter,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function ShowRecords() {
  const data = useAppSelector((state) => state.payments);
  const { yearMonth } = useAppSelector((state) => state.dateSlice);
  const dispatch = useDispatch();

  const filterByyearMonth = ({ date }: Transaction) => {
    return date.includes(yearMonth);
  };

  useEffect(() => {
    dispatch(setFilterData(data));
  }, [data, yearMonth]);

  const filterData = useMemo(() => data.filter(filterByyearMonth), [yearMonth]);

  // @ts-ignore
  const filterByDate: Transaction = filterData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((acc, item) => {
      // @ts-ignore
      const arr = (acc[item.date] ||= []);
      arr.unshift(item);
      return acc;
    }, {});
  const totalExpense = filterData
    .map(({ debit }) => debit)
    .filter(Boolean)
    .reduce((x, y) => {
      // @ts-ignore
      return x + y;
    }, 0);

  const totalIncome = filterData
    .map(({ credit }) => credit)
    .filter(Boolean)
    .reduce((x, y) => {
      // @ts-ignore
      return x + y;
    }, 0);
  const totalBalance = (totalIncome || 0) - (totalExpense || 0);
  const isBalancePositive =
    Math.sign(totalBalance) === 1 || Math.sign(totalBalance) === 0;
  return (
    <div className='pb-6'>
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
              {totalExpense ? `${formattedAmount(totalExpense, true)}` : 0}
            </span>
          </div>
          <div className='flex flex-col text-center'>
            <span>Income</span>
            <span className='text-green-600 dark:text-green-400 '>
              {totalIncome ? `${formattedAmount(totalIncome, true)}` : 0}
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
              {totalBalance ? `${formattedAmount(totalBalance, true)}` : 0}
            </span>
          </div>
        </h4>
        <LucideListFilter
          role='button'
          className='absolute top-3 h-10 w-10 p-2 -right-2 hover:bg-secondary rounded-md'
        />
      </header>
      <div className='flex flex-col gap-y-5'>
        {Object.entries(filterByDate).map(([date, item]) => {
          return (
            <section key={date} className='py-3 border-b-2'>
              <h5 className='text-lg font-semibold mb-2'>
                {format(date, 'MMM dd, EEEE')}
              </h5>
              {item.map((row: Transaction) => {
                // @ts-ignore
                let [_, receiver, msg, info] = row.details?.split('/');
                receiver = /[a-z]/i.test(receiver) ? receiver : info;

                return (
                  <section
                    key={row.id}
                    className='flex py-2 items-center justify-between border-t'
                  >
                    <div className='flex space-x-2 items-center'>
                      {/* Icon */}
                      <p className='row-span-2'>
                        <LucideBadgeIndianRupee />
                      </p>
                      <div className='flex flex-col gap-y-0.5 justify-start'>
                        {/* Receiver */}
                        <p className='flex items-center gap-x-1'>
                          <LucideCornerUpRight size={16} />
                          <span className='font-semibold'>{receiver}</span>
                        </p>
                        <p className='text-sm flex items-center gap-x-1'>
                          <LucideCornerLeftUp size={16} />
                          {row.mode}
                        </p>
                        {/* Mode */}
                      </div>
                    </div>
                    {row.credit ? (
                      <span className='text-green-600 dark:text-green-400 font-bold'>
                        {`+${formattedAmount(row.credit, true)}`}
                      </span>
                    ) : row.debit ? (
                      <span className='text-red-600 dark:text-red-400 font-bold'>
                        {`-${formattedAmount(row.debit, true)}`}
                      </span>
                    ) : (
                      <span className='font-bold'>0</span>
                    )}
                  </section>
                );
              })}
            </section>
          );
        })}
        {Object.keys(filterByDate).length === 0 && (
          <div className='flex flex-col gap-y-3 py-5 space-x-2 items-center justify-center'>
            <h4>No record in this month.</h4>
            <Link to='/'>
              <Button variant='secondary' className='text-lg'>
                Click here to add
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
