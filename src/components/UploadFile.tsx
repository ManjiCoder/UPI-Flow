import { setRows } from '@/redux/features/UPI/paymentsSlices';
import { useAppDispatch } from '@/redux/hooks';
import passbook from '@/utils/Passbook';
import * as PDFJS from 'pdfjs-dist';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
PDFJS.GlobalWorkerOptions.workerSrc = `${
  import.meta.env.VITE_BASE_URL
}/pdf.worker.mjs`;

export default function UploadFile() {
  // const navigator = useNavigate();
  const [pdfText, setPdfText] = useState('');
  const dispatch = useAppDispatch();

  const onSuccess = async (event: ProgressEvent<FileReader>) => {
    try {
      if (!event.target || !event.target.result) return;
      const fileBuffer = event.target.result;
      const data = await PDFJS.getDocument({
        data: fileBuffer,
        password: '12121',
      }).promise;
      const totalPages = data.numPages;

      let text = '';
      for (let i = 1; i <= totalPages; i++) {
        const page = await data.getPage(i);
        const pageText = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const textContext = pageText.items.map((obj) => obj.str).join('\n');
        text += textContext;
      }
      setPdfText(text);
      // console.log(text);
      const rows = passbook(text);
      console.table(rows);
      dispatch(setRows(rows));
      // navigator('/records');
    } catch (error) {
      console.error(error, 'Error occured while extacting text');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = onSuccess;

      reader.onerror = (error) => {
        console.error(error, 'Error occured while reading file');
      };
    }
  };
  return (
    <div className='grid mx-auto w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Select PDF</Label>
      <Input
        id='picture'
        type='file'
        accept='application/pdf'
        onChange={handleChange}
      />
      <pre className='overflow-hidden pt-10 text-sm'>{pdfText}</pre>
    </div>
  );
}
