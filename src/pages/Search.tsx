import PageWrapper from '@/components/layout/PageWrapper';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';
import {
  CalendarSearch,
  LucideBadgeIndianRupee,
  LucideCornerLeftUp,
  LucideCornerUpRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Search() {
  const { data } = useAppSelector((state) => state.payments);
  const [text, setText] = useState('gharjan');
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const showSearchResults = (searchText: string) => {
    return new Promise<Transaction[] | false>((res, rej) => {
      try {
        const newData = data.map((item) => {
          return { ...item, date: format(item.date, 'dd-MMM-yyyy') };
        });
        if (searchText.trim().length === 0) res([]);
        const result = newData
          .filter((item) => {
            return JSON.stringify(item)
              .toLowerCase()
              .includes(searchText.toLowerCase());
          })
          .sort((a, b) => b.id - a.id);
        res(result);
      } catch (error) {
        rej(false);
      }
    });
  };

  useEffect(() => {
    // Deboucing
    const timerId = setTimeout(async () => {
      const data = await showSearchResults(text);
      if (data) {
        setSearchResults(data);
      }
    }, 500);

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [text]);

  return (
    <PageWrapper className='gap-y-5'>
      <Input
        type='search'
        placeholder='Search for records'
        autoFocus
        onChange={handleChange}
        value={text}
      />

      {searchResults.length === 0 && (
        <div className='min-h-[60vh] flex flex-col gap-3 items-center justify-center'>
          <CalendarSearch size={70} />
          <h4>Search Records.</h4>
        </div>
      )}
      <div>
        <h3 className='text-center line-clamp-1'>
          {searchResults.length !== 0 &&
            searchResults.length + ' Results found.'}
        </h3>
        {searchResults.map((row) => {
          return (
            <section key={row.id} className='py-3 border-b-2'>
              <h5 className='text-lg font-semibold mb-2'>
                {format(row.date, 'MMM dd, EEEE')}
              </h5>

              <div className='flex py-2 items-center justify-between border-t'>
                <div className='flex space-x-2 items-center'>
                  {/* Icon */}
                  <p className='row-span-2'>
                    <LucideBadgeIndianRupee />
                  </p>
                  <div className='flex flex-col gap-y-0.5 justify-start'>
                    {/* Receiver */}
                    <p className='flex items-center gap-x-1'>
                      <LucideCornerUpRight size={16} />
                      <span className='font-semibold'>{row.to}</span>
                    </p>
                    <p className='text-sm flex items-center gap-x-1'>
                      <LucideCornerLeftUp size={16} />
                      {row.mode}
                    </p>
                    {/* Mode */}
                  </div>
                </div>
                {row.credit ? (
                  <span className='text-green-600 dark:text-green-400 font-bold'>
                    {`+${formattedAmount(row.credit, true)}`}
                  </span>
                ) : row.debit ? (
                  <span className='text-red-600 dark:text-red-400 font-bold'>
                    {`-${formattedAmount(row.debit, true)}`}
                  </span>
                ) : (
                  <span className='font-bold'>0</span>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PageWrapper>
  );
}
