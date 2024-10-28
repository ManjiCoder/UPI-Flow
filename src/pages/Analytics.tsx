import FlowInfo from '@/components/FlowInfo';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAppSelector } from '@/redux/hooks';

export default function Analytics() {
  const { filterData } = useAppSelector((state) => state.dateSlice);
  console.log(filterData);
  return (
    <PageWrapper className='pt-0'>
      <FlowInfo />
    </PageWrapper>
  );
}
