import PageWrapper from '@/components/PageWrapper';
import UploadFile from '@/components/UploadFile';
import { appInfo } from '@/types/constant';

export default function Home() {
  return (
    <PageWrapper>
      <h2 className='scroll-m-20 text-primary text-center pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        {appInfo.title}
      </h2>
      <UploadFile />
    </PageWrapper>
  );
}
