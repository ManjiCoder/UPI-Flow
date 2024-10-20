import PageWrapper from '@/components/layout/PageWrapper';
import passbook from '@/utils/Passbook';
import { useEffect, useState } from 'react';
import { str } from './temp';

export default function Test() {
  const [text, setText] = useState(str);

  useEffect(() => {
    const newText = passbook(str);
    console.log(newText);
    if (newText) {
      setText(newText);
    }
  }, []);

  return (
    <PageWrapper className='text-sm'>
      <pre>{text}</pre>
    </PageWrapper>
  );
}
