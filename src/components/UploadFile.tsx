import { setRows } from '@/redux/features/UPI/paymentsSlices';
import { useAppDispatch } from '@/redux/hooks';
import passbook from '@/utils/Passbook';
import { File } from 'buffer';
import * as PDFJS from 'pdfjs-dist';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from './ui/input';
import { Label } from './ui/label';
PDFJS.GlobalWorkerOptions.workerSrc = `${
  import.meta.env.VITE_BASE_URL
}/pdf.worker.mjs`;

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UploadFile() {
  const navigator = useNavigate();
  const [pdfText, setPdfText] = useState('');
  const [pass, setPass] = useState('');
  const [isPass, setIsPass] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const onSuccess = async (event: ProgressEvent<FileReader>) => {
    const toastId = toast.loading('Processing...');
    try {
      if (!event.target || !event.target.result) return;
      const fileBuffer = event.target.result;
      const data = await PDFJS.getDocument({
        data: fileBuffer,
        password: pass,
      }).promise;
      const totalPages = data.numPages;

      let text = '';
      for (let i = 1; i <= totalPages; i++) {
        const page = await data.getPage(i);
        const pageText = await page.getTextContent();
        // @ts-ignore
        const textContext = pageText.items.map((obj) => obj.str).join('\n');
        text += textContext;
      }
      setPdfText(text);
      // console.log(text);
      const rows = passbook(text);
      console.table(rows);
      if (!rows) {
        return toast.update(toastId, {
          render: 'PDF invalid for logic',
          type: 'warning',
          isLoading: false,
          autoClose: 3000,
        });
      }
      dispatch(setRows(rows));
      toast.update(toastId, {
        render: 'Text processed successfully',
        type: 'success',
        isLoading: false,
        className: 'rotateY animated',
        autoClose: 2000,
        closeButton: true,
      });
      navigator('/records');
    } catch (error) {
      toast.update(toastId, {
        // @ts-ignore
        render: error.message || 'Error occurred while extracting text',
        type: 'error',
        isLoading: false,
        className: 'rotateY animated',
        autoClose: 3000,
        closeButton: true,
      });
      console.error(error, 'Error occured while extacting text');
      setIsPass(true);
    }
  };

  const proccessFile = (file: File | null) => {
    if (!file) return toast.warn('File is missing.');

    const reader = new FileReader();
    // @ts-ignore
    reader.readAsArrayBuffer(file);

    reader.onload = onSuccess;

    reader.onerror = (error) => {
      console.error(error, 'Error occured while reading file');
    };
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files && e.target.files[0];
    // console.log(file, 'change');
    if (targetFile) {
      try {
        // @ts-ignore
        setFile(targetFile);
      } catch (error) {}
      // @ts-ignore
      proccessFile(targetFile);
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
        value={''}
      />

      <AlertDialog open={isPass} onOpenChange={setIsPass}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='line-clamp-1'>
              Enter Password{' '}
              <span className='font-normal'>
                {file ? `for ${file.name}` : ''}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className='text-balance'>
              The selected file: ${file?.name} is password protected, please
              provide password to procced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type='password'
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            autoFocus={true}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => proccessFile(file)}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <pre className='overflow-hidden pt-10 text-sm'>{pdfText}</pre>
    </div>
  );
}
