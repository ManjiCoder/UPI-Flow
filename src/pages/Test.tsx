import PageWrapper from '@/components/layout/PageWrapper';
import { generateICICIRecords } from '@/utils/Passbook';
import { useEffect, useState } from 'react';
import { str } from './temp';

export default function Test() {
  // @ts-ignore
  const [text, setText] = useState(str);

  useEffect(() => {
    const newText = generateICICIRecords(str);
    if (newText) {
      // const error = newText.slice(-10);
      // console.table(error);
      console.table(newText);
      // setText(newText);
    }
  }, []);

  return (
    <PageWrapper className='text-sm'>
      <pre>{text}</pre>
    </PageWrapper>
  );
}
