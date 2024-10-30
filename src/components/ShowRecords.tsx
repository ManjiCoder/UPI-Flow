import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';
import {
  LucideBadgeIndianRupee,
  LucideCornerLeftUp,
  LucideCornerUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FlowInfo from './FlowInfo';
import { Button } from './ui/button';

export default function ShowRecords() {
  const { filterData } = useAppSelector((state) => state.dateSlice);
  return (
    <div className='pb-6'>
      <FlowInfo />
      <div className='flex flex-col gap-y-5'>
        {Object.entries(filterData).map(([date, item]) => {
          return (
            <section key={date} className='py-3 border-b-2'>
              <h5 className='text-lg font-semibold mb-2'>
                {format(date, 'MMM dd, EEEE')}
              </h5>
              {item.map((row: Transaction) => {
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
                          <span className='font-semibold'>
                            {row.receiver ? row.receiver : row.to}
                          </span>
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
        {Object.keys(filterData).length === 0 && (
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
