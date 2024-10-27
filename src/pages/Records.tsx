import PageWrapper from '@/components/layout/PageWrapper';
import ShowRecords from '@/components/ShowRecords';

export default function Records() {
  return (
    <PageWrapper className='!pt-0'>
      <ShowRecords />
      {/* <DataTable data={data} /> */}
    </PageWrapper>
  );
}
