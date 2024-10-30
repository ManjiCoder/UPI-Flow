import PageWrapper from '@/components/layout/PageWrapper';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Search() {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <PageWrapper>
      <Input
        type='search'
        placeholder='Search for records'
        autoFocus
        onChange={handleChange}
        value={text}
      />
    </PageWrapper>
  );
}
