import PageWrapper from '@/components/layout/PageWrapper';
import { generateICICIRecords } from '@/utils/Passbook';
import { useEffect, useState } from 'react';
import { str } from './temp';

export default function Test() {
  const [text, setText] = useState(str);

  useEffect(() => {
    const newText = generateICICIRecords(str);
    if (newText) {
      const error = newText.filter((obj) => /[a-z]/i.test(obj.balance));
      console.table(error);
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
