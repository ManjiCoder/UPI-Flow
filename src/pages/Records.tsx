import { DataTable } from '@/components/DataTable';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAppSelector } from '@/redux/hooks';

export default function Records() {
  const data = useAppSelector((state) => state.payments);

  return (
    <PageWrapper>
      <h1 className='text-center'>Records</h1>
      <DataTable data={data} />
    </PageWrapper>
  );
}
