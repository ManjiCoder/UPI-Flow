import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { addMonths, format, subMonths } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  LucideBadgeIndianRupee,
  LucideCornerLeftUp,
  LucideCornerUpRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
  const totalBalance = (totalIncome || 0) - (totalExpense || 0);
  const isBalancePositive =
    Math.sign(totalBalance) === 1 || Math.sign(totalBalance) === 0;
  return (
    <div className='pb-6'>
      <header className='flex  py-3 flex-col sticky top-0 backdrop-blur-sm border-b-2 mb-4'>
        <h3 className='flex border-none justify-between'>
          <ArrowLeft role='button' size={26} onClick={decreamentYearMonth} />
          {format(new Date(yearMonth), 'MMMM, yyyy')}
          <ArrowRight role='button' size={26} onClick={incrementYearMonth} />
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
                  <section className='flex py-2 items-center justify-between border-t'>
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
      </div>
    </div>
  );
}
