import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { addMonths, format, subMonths } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Records() {
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
  return (
    <PageWrapper>
      <h1 className='flex justify-between'>
        <Button variant='ghost' onClick={decreamentYearMonth}>
          <ArrowLeft />
        </Button>
        {format(new Date(yearMonth), 'MMM-yyyy')}
        <Button variant='ghost' onClick={incrementYearMonth}>
          <ArrowRight />
        </Button>
      </h1>
      {/* <DataTable data={data} /> */}
      {filterData.map((row) => {
        return (
          <section key={row.id} className='border-b-2'>
            <h5 className='text-lg font-semibold'>
              {format(row.date, 'MMMM dd, EEEE')}
            </h5>
            <div>{row.mode}</div>
            <div>{row.credit}</div>
            <div>{row.debit}</div>
            <div>{row.balance}</div>
          </section>
        );
      })}
    </PageWrapper>
  );
}
