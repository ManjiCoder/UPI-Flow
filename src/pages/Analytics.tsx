import PageWrapper from '@/components/layout/PageWrapper';
import MonthlyChart from '@/components/MonthlyChart';
import { useAppSelector } from '@/redux/hooks';
import { format } from 'date-fns';

export default function Analytics() {
  const data = useAppSelector((state) => state.payments);
  const monthsName = Array.from(
    new Set(data.map(({ date }) => format(date, 'yyyy-MM')))
  );
  const totalCredit = monthsName.map((yearMonth) => {
    return data
      .filter(({ date }) => date?.includes(yearMonth))
      .flatMap((obj) => obj.credit)
      .filter(Boolean)
      .reduce((x, y) => {
        // @ts-ignore
        return x + y;
      }, 0);
  });

  const totalDebit = monthsName.map((yearMonth) => {
    return data
      .filter(({ date }) => date?.includes(yearMonth))
      .map((obj) => obj.debit)
      .filter(Boolean)
      .reduce((x, y) => {
        // @ts-ignore
        return x + y;
      }, 0);
  });
  const chartData = monthsName.map((yearMonth, i) => {
    return {
      date: format(yearMonth, 'MMM-yy'),
      credit: totalCredit[i],
      debit: totalDebit[i],
    };
  });

  return (
    <PageWrapper>
      <h1 className='text-center'>Analytics</h1>
      <MonthlyChart chartData={chartData} />
    </PageWrapper>
  );
}
