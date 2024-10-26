import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { addMonths, format, subMonths } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  // @ts-ignore
  const totalBalance = totalIncome - totalExpense;
  return (
    <div>
      <header className='flex  py-3 flex-col sticky top-0 backdrop-blur-sm pb-4 border-b-2 '>
        <h1 className='flex border-none justify-between'>
          <Button variant='ghost' onClick={decreamentYearMonth}>
            <ArrowLeft />
          </Button>
          {format(new Date(yearMonth), 'MMM-yyyy')}
          <Button variant='ghost' onClick={incrementYearMonth}>
            <ArrowRight />
          </Button>
        </h1>
        <h3 className='flex text-2xl font-semibold justify-between'>
          <span className='text-red-600 dark:text-red-400'>
            Expense:{' '}
            {totalExpense ? `${formattedAmount(totalExpense, true)}` : 0}
          </span>
          <span className='text-green-600 dark:text-green-400'>
            Income: {totalIncome ? `${formattedAmount(totalIncome, true)}` : 0}
          </span>
          <span className='text-primary'>
            Balance:{' '}
            {totalBalance ? `${formattedAmount(totalBalance, true)}` : 0}
          </span>
        </h3>
      </header>
      {filterData.map((row) => {
        return (
          <section key={row.id} className=''>
            <h5 className='text-lg font-semibold'>
              {format(row.date, 'MMM dd, EEEE')}
            </h5>
            <section className='flex justify-between'>
              <div>{row.mode}</div>
              {row.credit ? (
                <span className='text-green-600 dark:text-green-400 font-bold'>
                  {`${formattedAmount(row.credit, true)}`}
                </span>
              ) : (
                <span className='text-red-600 dark:text-red-400 font-bold'>
                  {`${formattedAmount(row.debit, true)}`}
                </span>
              )}
            </section>
          </section>
        );
      })}
    </div>
  );
}
