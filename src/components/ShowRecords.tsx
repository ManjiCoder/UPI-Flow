import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { addMonths, format, subMonths } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  LucideChevronsUp,
  LucideIndianRupee,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';

export default function ShowRecords() {
  const data = useAppSelector((state) => state.payments);
  const [yearMonth, setYearMonth] = useState(() => {
    return format(new Date(), 'yyyy-MM');
  });
  const filterByyearMonth = ({ date }: Transaction) => {
    return date.includes(yearMonth);
  };
  const incrementYearMonth = () => {
    const data = format(addMonths(new Date(yearMonth), 1), 'yyyy-MM');
    setYearMonth(data);
  };
  const decreamentYearMonth = () => {
    const data = format(subMonths(new Date(yearMonth), 1), 'yyyy-MM');
    setYearMonth(data);
  };
  const filterData = useMemo(() => data.filter(filterByyearMonth), [yearMonth]);

  // @ts-ignore
  const filterByDate: Transaction = filterData.reduce((acc, item) => {
    // @ts-ignore
    const arr = (acc[item.date] ||= []);
    arr.push(item);
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
  const totalBalance = (totalExpense || 0) - (totalIncome || 0);

  return (
    <div className='pb-6'>
      <header className='flex  py-3 flex-col sticky top-0 backdrop-blur-sm border-b-2 mb-4'>
        <h3 className='flex border-none justify-between'>
          <Button variant='ghost' onClick={decreamentYearMonth}>
            <ArrowLeft />
          </Button>
          {format(new Date(yearMonth), 'MMM-yyyy')}
          <Button variant='ghost' onClick={incrementYearMonth}>
            <ArrowRight />
          </Button>
        </h3>
        <h4 className='flex justify-between'>
          <span className='text-red-600 dark:text-red-400 flex flex-col text-left'>
            <span>Expense </span>
            {totalExpense ? `${formattedAmount(totalExpense, true)}` : 0}
          </span>
          <span className='text-green-600 dark:text-green-400 flex flex-col text-center'>
            <span>Income</span>{' '}
            {totalIncome ? `${formattedAmount(totalIncome, true)}` : 0}
          </span>
          <span className='text-primary flex flex-col text-right'>
            <span>Balance </span>
            {totalBalance ? `${formattedAmount(totalBalance, true)}` : 0}
          </span>
        </h4>
      </header>
      <div className='flex flex-col gap-y-5'>
        {Object.entries(filterByDate).map(([date, item], idx, arr) => {
          return (
            <section key={date} className='py-3 border-b-2'>
              <h5 className='text-lg font-semibold'>
                {format(date, 'MMM dd, EEEE')}
              </h5>
              {item.map((row: Transaction) => {
                // @ts-ignore
                const [_, receiver, msg] = row.details?.split('/');
                return (
                  <section className='flex py-2 items-center justify-between border-t'>
                    <div className='flex space-x-2 items-center'>
                      {/* Icon */}
                      <p className='row-span-2'>
                        <LucideIndianRupee />
                      </p>
                      <div className='flex flex-col gap-y-0.5 justify-start'>
                        {/* Receiver */}
                        <p className='flex items-center gap-x-1'>
                          <UserCheck size={16} />
                          {receiver}
                        </p>
                        <p className='text-sm flex items-center gap-x-1'>
                          <LucideChevronsUp size={16} />
                          {row.mode}
                        </p>
                        {/* Mode */}
                      </div>
                    </div>
                    {row.credit ? (
                      <span className='text-green-600 dark:text-green-400 font-bold'>
                        {`${formattedAmount(row.credit, true)}`}
                      </span>
                    ) : row.debit ? (
                      <span className='text-red-600 dark:text-red-400 font-bold'>
                        {`${formattedAmount(row.debit, true)}`}
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
      </div>
    </div>
  );
}
