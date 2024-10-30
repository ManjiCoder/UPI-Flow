import PageWrapper from '@/components/layout/PageWrapper';
import { useEffect } from 'react';

export default function Settings() {
  useEffect(() => {
    // const rows = passbook(bank);
    // const temp = rows.map((item) => {
    //   return {
    //     date: format(item.date, 'dd-MMM-yyyy'),
    //     to: item.to,
    //     info: item.details,
    //   };
    // });
    // console.table(temp);
    // console.table(rows);
  }, []);

  return (
    <PageWrapper>
      <h1>Settings</h1>
    </PageWrapper>
  );
}
