import PageWrapper from '@/components/layout/PageWrapper';
import UploadFile from '@/components/UploadFile';
import { appInfo } from '@/types/constant';

export default function Home() {
  return (
    <PageWrapper className=''>
      <h1 className='text-center text-primary'>{appInfo.title}</h1>

      <UploadFile />
    </PageWrapper>
  );
}
